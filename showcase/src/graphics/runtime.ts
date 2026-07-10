import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
  Texture,
  Vector2,
  WebGLRenderer
} from "three";
import type { BufferGeometry, Camera, Material, Mesh, Object3D, Scene } from "three";

const FULL_RENDER_PIXEL_BUDGET = 1_600_000;
const LOW_POWER_RENDER_PIXEL_BUDGET = 720_000;
const FULL_RENDER_DIMENSION_CAP = 3_072;
const LOW_POWER_RENDER_DIMENSION_CAP = 2_048;

export type GraphicsPolicy = Readonly<{
  lowPower: boolean;
  reason: "forced" | "save-data" | "small-viewport" | "standard";
  maxRenderPixels: number;
}>;

export type SceneController = Readonly<{
  scene: Scene;
  camera: Camera;
  update: (timeSeconds: number, deltaSeconds: number) => void;
  snap?: () => void;
  resize?: (width: number, height: number) => void;
  dispose: () => void;
}>;

export type MountedThreeScene = Readonly<{
  dispose: () => void;
  invalidate: () => void;
  setReducedMotion: (reduced: boolean) => void;
}>;

type MountOptions = Readonly<{
  reducedMotion: boolean;
  onFallback: (reason: string) => void;
  create: (renderer: WebGLRenderer, policy: GraphicsPolicy) => SceneController;
}>;

type NavigatorWithConnection = Navigator & Readonly<{
  connection?: Readonly<{ saveData?: boolean }>;
}>;

function requestedFallback() {
  const parameters = new URLSearchParams(window.location.search);
  if (parameters.get("noWebgl") === "1") return "The authored no-WebGL composition is active.";
  if (parameters.get("static") === "1") return "The authored static composition is active.";
  return "";
}

function resolveGraphicsPolicy(viewportWidth = window.innerWidth): GraphicsPolicy {
  const parameters = new URLSearchParams(window.location.search);
  const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
  const reason = parameters.get("lowPower") === "1"
    ? "forced"
    : saveData
      ? "save-data"
      : viewportWidth <= 620
        ? "small-viewport"
        : "standard";
  const lowPower = reason !== "standard";
  return Object.freeze({
    lowPower,
    reason,
    maxRenderPixels: lowPower ? LOW_POWER_RENDER_PIXEL_BUDGET : FULL_RENDER_PIXEL_BUDGET
  });
}

function inertMount(): MountedThreeScene {
  return Object.freeze({
    dispose: () => undefined,
    invalidate: () => undefined,
    setReducedMotion: () => undefined
  });
}

export function mountThreeScene(canvas: HTMLCanvasElement, options: MountOptions): MountedThreeScene {
  const fallbackReason = requestedFallback();
  if (fallbackReason) {
    options.onFallback(fallbackReason);
    return inertMount();
  }

  let policy = resolveGraphicsPolicy();
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: !policy.lowPower,
      alpha: true,
      powerPreference: "default"
    });
  } catch {
    options.onFallback("WebGL is unavailable; the semantic fallback remains complete.");
    return inertMount();
  }

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  let controller: SceneController | null = null;
  try {
    controller = options.create(renderer, policy);
  } catch {
    renderer.dispose();
    options.onFallback("The graphics scene could not start; the semantic fallback remains complete.");
    return inertMount();
  }

  let reducedMotion = options.reducedMotion;
  let userPaused = document.documentElement.dataset.userMotion === "paused";
  let visible = true;
  let disposed = false;
  let permanentFailure = false;
  let contextLost = false;
  let loopRunning = false;
  let pendingRender = false;
  let oneShotFrame = 0;
  let previousTime = performance.now();
  let renderedFrames = 0;
  let renderPixels = 0;
  let latestWidth = 1;
  let latestHeight = 1;

  const safeDisposeController = () => {
    if (!controller) return;
    try {
      controller.dispose();
    } catch {
      // Teardown must remain contained so the authored fallback can still render.
    }
    controller = null;
  };

  const shouldAnimate = () => (
    !disposed
    && !permanentFailure
    && !contextLost
    && !reducedMotion
    && !policy.lowPower
    && !userPaused
    && visible
    && document.visibilityState === "visible"
  );

  function stopLoop() {
    if (!loopRunning) return;
    renderer.setAnimationLoop(null);
    loopRunning = false;
  }

  const failPermanently = (reason: string) => {
    if (permanentFailure || disposed) return;
    permanentFailure = true;
    stopLoop();
    if (oneShotFrame) cancelAnimationFrame(oneShotFrame);
    oneShotFrame = 0;
    safeDisposeController();
    options.onFallback(reason);
  };

  const renderFrame = (time = performance.now(), snap = false) => {
    if (disposed || permanentFailure || contextLost || !controller) return false;
    try {
      const delta = Math.min(0.05, Math.max(0, (time - previousTime) / 1_000));
      previousTime = time;
      if (snap && controller.snap) controller.snap();
      else controller.update(time / 1_000, delta || 1 / 60);
      renderer.render(controller.scene, controller.camera);
      renderedFrames += 1;
      pendingRender = false;
      return true;
    } catch {
      failPermanently("The graphics renderer stopped safely; the semantic fallback preserves the story and action.");
      return false;
    }
  };

  const loop = (time: number) => {
    if (!shouldAnimate()) {
      stopLoop();
      return;
    }
    renderFrame(time);
  };

  const startLoop = () => {
    if (loopRunning || !shouldAnimate()) return;
    previousTime = performance.now();
    loopRunning = true;
    renderer.setAnimationLoop(loop);
  };

  const syncLoop = () => {
    if (shouldAnimate()) startLoop();
    else stopLoop();
  };

  const scheduleOneShot = () => {
    if (oneShotFrame || disposed || permanentFailure || contextLost || !controller) return;
    if (!visible || document.visibilityState !== "visible") {
      pendingRender = true;
      return;
    }
    oneShotFrame = requestAnimationFrame((time) => {
      oneShotFrame = 0;
      renderFrame(time, !shouldAnimate());
    });
  };

  const invalidate = () => {
    pendingRender = true;
    if (!loopRunning) scheduleOneShot();
  };

  const applyRenderBudget = (width: number, height: number) => {
    const dimensionCap = policy.lowPower ? LOW_POWER_RENDER_DIMENSION_CAP : FULL_RENDER_DIMENSION_CAP;
    const deviceRatio = Math.min(window.devicePixelRatio || 1, policy.lowPower ? 1.1 : 1.5);
    const pixelRatio = Math.min(
      deviceRatio,
      Math.sqrt(policy.maxRenderPixels / Math.max(1, width * height)),
      dimensionCap / width,
      dimensionCap / height
    );
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);

    const drawingBuffer = renderer.getDrawingBufferSize(new Vector2());
    renderPixels = drawingBuffer.x * drawingBuffer.y;
    if (renderPixels > policy.maxRenderPixels) {
      renderer.setPixelRatio(pixelRatio * Math.sqrt(policy.maxRenderPixels / renderPixels) * 0.999);
      renderer.setSize(width, height, false);
      renderer.getDrawingBufferSize(drawingBuffer);
      renderPixels = drawingBuffer.x * drawingBuffer.y;
    }
  };

  const rebuildController = () => {
    safeDisposeController();
    try {
      controller = options.create(renderer, policy);
      return true;
    } catch {
      failPermanently("The graphics scene could not be rebuilt; the semantic fallback remains complete.");
      return false;
    }
  };

  const resize = (renderAfter = true) => {
    if (disposed || permanentFailure || contextLost || !controller) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const nextPolicy = resolveGraphicsPolicy(window.innerWidth);
    const policyChanged = nextPolicy.lowPower !== policy.lowPower || nextPolicy.reason !== policy.reason;
    policy = nextPolicy;
    if (policyChanged && !rebuildController()) return;
    latestWidth = width;
    latestHeight = height;
    applyRenderBudget(width, height);
    controller?.resize?.(width, height);
    syncLoop();
    if (renderAfter) invalidate();
  };

  const onVisibility = () => {
    syncLoop();
    if (document.visibilityState === "visible" && (pendingRender || !loopRunning)) invalidate();
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    stopLoop();
    if (oneShotFrame) cancelAnimationFrame(oneShotFrame);
    oneShotFrame = 0;
    options.onFallback("The graphics context was lost; the fallback preserves the story and action.");
  };

  const onContextRestored = () => {
    if (disposed || permanentFailure) return;
    if (!rebuildController()) return;
    contextLost = false;
    options.onFallback("");
    applyRenderBudget(latestWidth, latestHeight);
    controller?.resize?.(latestWidth, latestHeight);
    renderFrame(performance.now(), true);
    syncLoop();
  };

  const onMotionToggle = (event: Event) => {
    const detail = (event as CustomEvent<{ paused?: boolean }>).detail;
    userPaused = detail?.paused ?? document.documentElement.dataset.userMotion === "paused";
    syncLoop();
    if (!userPaused) invalidate();
  };

  const resizeObserver = new ResizeObserver(() => resize());
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    const nextVisible = entry?.isIntersecting ?? true;
    if (nextVisible === visible) return;
    visible = nextVisible;
    syncLoop();
    if (visible) invalidate();
  }, { rootMargin: "160px" });

  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("demeta-motion-toggle", onMotionToggle);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  resize(false);
  renderFrame(performance.now(), true);
  syncLoop();

  Object.defineProperty(canvas, "__demetaRendererInfo", {
    configurable: true,
    value: () => ({
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      pixelRatio: renderer.getPixelRatio(),
      renderPixels,
      maxRenderPixels: policy.maxRenderPixels,
      frames: renderedFrames,
      lowPower: policy.lowPower,
      policyReason: policy.reason,
      animationRunning: loopRunning,
      visible,
      contextLost
    })
  });

  const setReducedMotion = (reduced: boolean) => {
    if (reducedMotion === reduced || disposed || permanentFailure) return;
    reducedMotion = reduced;
    syncLoop();
    invalidate();
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stopLoop();
    if (oneShotFrame) cancelAnimationFrame(oneShotFrame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("demeta-motion-toggle", onMotionToggle);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    safeDisposeController();
    renderer.renderLists.dispose();
    renderer.dispose();
    delete (canvas as HTMLCanvasElement & { __demetaRendererInfo?: unknown }).__demetaRendererInfo;
  };

  return Object.freeze({ dispose, invalidate, setReducedMotion });
}

export function disposeObject(root: Object3D) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const objectMaterials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    objectMaterials.forEach((material) => materials.add(material));
  });

  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value instanceof Texture) textures.add(value);
    });
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}
