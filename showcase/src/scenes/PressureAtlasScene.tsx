import { useEffect, useRef, useState } from "react";
import {
  DoubleSide,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2
} from "three";
import { GraphicsFallback } from "../components/GraphicsFallback";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { mountThreeScene, type MountedThreeScene, type SceneController } from "../graphics/runtime";

type Props = Readonly<{
  depth: number;
  lens: readonly [number, number];
}>;

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uDepth;

  float terrain(vec2 p) {
    float ridge = sin(p.x * 2.2 + cos(p.y * 1.3)) * 0.18;
    ridge += sin(p.y * 3.8 - p.x * 0.7) * 0.09;
    float trench = -1.15 * exp(-pow(p.x * 0.42 + 0.25, 2.0) - pow(p.y * 0.34 - 0.1, 2.0));
    float shelf = 0.45 * smoothstep(-1.0, 0.7, p.y);
    return ridge + trench + shelf;
  }

  void main() {
    vUv = uv;
    vec3 displaced = position;
    float elevation = terrain(position.xy);
    displaced.z += elevation * (0.9 + uDepth * 0.28);
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uDepth;
  uniform vec2 uPointer;

  float lineField(vec2 p) {
    float a = sin((p.x * 10.0) + sin(p.y * 8.0 + uTime * 0.28) + uTime * 0.18);
    return smoothstep(0.91, 1.0, a);
  }

  void main() {
    vec3 porcelain = vec3(0.91, 0.96, 0.94);
    vec3 seaGlass = vec3(0.24, 0.67, 0.69);
    vec3 cobalt = vec3(0.03, 0.11, 0.25);
    vec3 coral = vec3(0.94, 0.25, 0.18);
    float depthMix = smoothstep(0.05, 1.0, uDepth * 0.92 + (1.0 - vUv.y) * 0.22);
    vec3 base = mix(porcelain, cobalt, depthMix);
    base = mix(base, seaGlass, smoothstep(-0.3, 0.5, vElevation) * (1.0 - depthMix * 0.7));
    float distanceToLens = distance(vUv, uPointer);
    float lens = 1.0 - smoothstep(0.19, 0.205, distanceToLens);
    float lensRing = smoothstep(0.196, 0.199, distanceToLens) - smoothstep(0.202, 0.205, distanceToLens);
    vec2 warped = vUv + vec2(
      sin(vUv.y * 27.0 + uTime * 0.5),
      cos(vUv.x * 22.0 - uTime * 0.35)
    ) * 0.006;
    float flow = lineField(warped) * 0.16;
    vec3 sonar = mix(cobalt, coral, smoothstep(-0.75, 0.5, vElevation));
    vec3 color = mix(base + flow, sonar, lens * 0.78);
    color += lensRing * coral * 1.8;
    float edge = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x))
      * smoothstep(0.0, 0.06, vUv.y) * (1.0 - smoothstep(0.94, 1.0, vUv.y));
    gl_FragColor = vec4(color, edge);
  }
`;

export function PressureAtlasScene({ depth, lens }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<MountedThreeScene | null>(null);
  const depthRef = useRef(depth);
  const pointerTargetRef = useRef(new Vector2(lens[0], lens[1]));
  const uniformsRef = useRef<{
    uTime: { value: number };
    uDepth: { value: number };
    uPointer: { value: Vector2 };
  } | null>(null);
  const reducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    depthRef.current = depth;
    if (uniformsRef.current) uniformsRef.current.uDepth.value = depthRef.current;
    runtimeRef.current?.invalidate();
  }, [depth]);

  useEffect(() => {
    pointerTargetRef.current.set(lens[0], lens[1]);
    if (uniformsRef.current) uniformsRef.current.uPointer.value.set(lens[0], lens[1]);
    runtimeRef.current?.invalidate();
  }, [lens]);

  useEffect(() => {
    runtimeRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const pointerTarget = pointerTargetRef.current;
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTarget.set(
        MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1),
        MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1)
      );
      runtimeRef.current?.invalidate();
    };
    canvas.addEventListener("pointermove", onPointer);

    const runtime = mountThreeScene(canvas, {
      reducedMotion,
      onFallback: setFallback,
      create: (renderer, policy): SceneController => {
        const scene = new Scene();
        const camera = new PerspectiveCamera(38, 1, 0.1, 50);
        camera.position.set(0, 0.2, 10.5);

        const geometry = new PlaneGeometry(12.4, 7.4, policy.lowPower ? 72 : 120, policy.lowPower ? 44 : 72);
        const uniforms = {
          uTime: { value: 0 },
          uDepth: { value: depthRef.current },
          uPointer: { value: pointerTarget.clone() }
        };
        uniformsRef.current = uniforms;
        const material = new ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          transparent: true,
          side: DoubleSide
        });
        const terrain = new Mesh(geometry, material);
        terrain.rotation.x = -0.12;
        terrain.rotation.z = -0.08;
        scene.add(terrain);

        const markerGeometry = new SphereGeometry(0.055, 12, 8);
        const markerMaterial = new MeshBasicMaterial({ color: 0xf06449 });
        const markers = new InstancedMesh(markerGeometry, markerMaterial, 5);
        const matrix = new Matrix4();
        [
          [-3.8, 1.5, 0.2],
          [-1.9, -0.4, -0.3],
          [0.25, 0.7, -0.55],
          [2.1, -1.6, 0.15],
          [3.55, 1.1, 0.42]
        ].forEach(([x, y, z], index) => {
          matrix.makeTranslation(x, y, z + 0.17);
          markers.setMatrixAt(index, matrix);
        });
        scene.add(markers);

        const applyState = (snap: boolean) => {
          uniforms.uDepth.value = depthRef.current;
          if (snap) uniforms.uPointer.value.copy(pointerTarget);
          camera.position.z = 10.5 - uniforms.uDepth.value * 0.9;
          camera.position.y = 0.2 - uniforms.uDepth.value * 0.25;
          terrain.rotation.z = -0.08 + uniforms.uDepth.value * 0.035;
          markers.rotation.z = terrain.rotation.z;
        };

        return {
          scene,
          camera,
          update: (time, delta) => {
            uniforms.uTime.value = time;
            uniforms.uPointer.value.lerp(pointerTarget, Math.min(1, delta * 7));
            applyState(false);
          },
          snap: () => {
            uniforms.uTime.value = 0;
            applyState(true);
          },
          resize: (width, height) => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setClearColor(0x000000, 0);
          },
          dispose: () => {
            geometry.dispose();
            material.dispose();
            markerGeometry.dispose();
            markerMaterial.dispose();
            uniformsRef.current = null;
          }
        };
      }
    });
    runtimeRef.current = runtime;

    return () => {
      canvas.removeEventListener("pointermove", onPointer);
      runtimeRef.current = null;
      runtime.dispose();
    };
  }, []);

  return (
    <div className="pressure-visual" data-testid="primary-visual">
      <canvas ref={canvasRef} aria-hidden="true" data-testid="primary-canvas" />
      {fallback && (
        <GraphicsFallback
          title="Depth transect"
          description="A static bathymetric route preserves the four depth states and specimen locations."
          variant="pressure"
        />
      )}
      <span className="visual-status" aria-live="polite">{fallback || "Choose a depth and lens position; pointer movement is an optional visual enhancement."}</span>
    </div>
  );
}

export default PressureAtlasScene;
