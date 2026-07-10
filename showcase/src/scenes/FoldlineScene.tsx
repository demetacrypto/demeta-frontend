import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  Vector2
} from "three";
import type { Material } from "three";
import { GraphicsFallback } from "../components/GraphicsFallback";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { mountThreeScene, type MountedThreeScene, type SceneController } from "../graphics/runtime";

export type ClothMode = "drape" | "fold" | "inspect";

type Props = Readonly<{ mode: ClothMode }>;

type ConstraintBuffers = Readonly<{
  left: Uint16Array;
  right: Uint16Array;
  rest: Float32Array;
}>;

const FIXED_STEP = 1 / 60;
const MAX_STEPS_PER_FRAME = 5;

function pageCrease(u: number, v: number) {
  const ridgeDistance = (u - 0.57) / 0.085;
  const sharpRidge = Math.exp(-(ridgeDistance * ridgeDistance)) * 1.38;
  const liftedLeaf = u > 0.57
    ? Math.sin(((u - 0.57) / 0.43) * Math.PI) * 0.58
    : 0;
  return (sharpRidge + liftedLeaf) * (1 - v * 0.34);
}

function createWeaveTexture(lowPower: boolean) {
  const size = lowPower ? 128 : 256;
  const source = document.createElement("canvas");
  source.width = size;
  source.height = size;
  const context = source.getContext("2d")!;
  context.fillStyle = "#d7dbd5";
  context.fillRect(0, 0, size, size);
  context.strokeStyle = "rgba(28,36,40,.18)";
  context.lineWidth = 1;
  for (let value = 0; value <= size; value += lowPower ? 4 : 5) {
    context.beginPath();
    context.moveTo(value, 0);
    context.lineTo(value, size);
    context.stroke();
    context.beginPath();
    context.moveTo(0, value);
    context.lineTo(size, value);
    context.stroke();
  }
  context.strokeStyle = "#dc4b35";
  context.lineWidth = lowPower ? 2 : 3;
  context.setLineDash(lowPower ? [6, 5] : [12, 9]);
  context.beginPath();
  context.moveTo(size * 0.11, size * 0.71);
  context.lineTo(size * 0.89, size * 0.41);
  context.stroke();
  const texture = new CanvasTexture(source);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.6, 1.3);
  return texture;
}

function createConstraints(columns: number, rows: number, width: number, height: number): ConstraintBuffers {
  const count = columns * (rows + 1) + rows * (columns + 1);
  const left = new Uint16Array(count);
  const right = new Uint16Array(count);
  const rest = new Float32Array(count);
  const horizontalRest = width / columns;
  const verticalRest = height / rows;
  let cursor = 0;

  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= columns; x += 1) {
      const index = y * (columns + 1) + x;
      if (x < columns) {
        left[cursor] = index;
        right[cursor] = index + 1;
        rest[cursor] = horizontalRest;
        cursor += 1;
      }
      if (y < rows) {
        left[cursor] = index;
        right[cursor] = index + columns + 1;
        rest[cursor] = verticalRest;
        cursor += 1;
      }
    }
  }

  return Object.freeze({ left, right, rest });
}

function satisfyConstraint(
  positions: Float32Array,
  left: number,
  right: number,
  rest: number,
  pinned: Uint8Array
) {
  const leftWeight = pinned[left] ? 0 : 1;
  const rightWeight = pinned[right] ? 0 : 1;
  const totalWeight = leftWeight + rightWeight;
  if (totalWeight === 0) return;

  const leftOffset = left * 3;
  const rightOffset = right * 3;
  const dx = positions[rightOffset] - positions[leftOffset];
  const dy = positions[rightOffset + 1] - positions[leftOffset + 1];
  const dz = positions[rightOffset + 2] - positions[leftOffset + 2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const correction = (distance - rest) / distance;

  if (leftWeight) {
    const weight = leftWeight / totalWeight;
    positions[leftOffset] += dx * correction * weight;
    positions[leftOffset + 1] += dy * correction * weight;
    positions[leftOffset + 2] += dz * correction * weight;
  }
  if (rightWeight) {
    const weight = rightWeight / totalWeight;
    positions[rightOffset] -= dx * correction * weight;
    positions[rightOffset + 1] -= dy * correction * weight;
    positions[rightOffset + 2] -= dz * correction * weight;
  }
}

export function FoldlineScene({ mode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<MountedThreeScene | null>(null);
  const modeRef = useRef(mode);
  const reducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    modeRef.current = mode;
    runtimeRef.current?.setReducedMotion(reducedMotion || mode === "inspect");
    runtimeRef.current?.invalidate();
  }, [mode, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const pointer = new Vector2(0.5, 0.5);
    let pointerActive = false;
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height);
      pointerActive = true;
      runtimeRef.current?.invalidate();
    };
    const onPointerLeave = () => {
      pointerActive = false;
      runtimeRef.current?.invalidate();
    };
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const runtime = mountThreeScene(canvas, {
      reducedMotion: reducedMotion || modeRef.current === "inspect",
      onFallback: setFallback,
      create: (renderer, policy): SceneController => {
        const scene = new Scene();
        const camera = new PerspectiveCamera(36, 1, 0.1, 50);
        camera.position.set(0, 0.1, 11.2);
        const columns = policy.lowPower ? 22 : 30;
        const rows = policy.lowPower ? 15 : 20;
        const width = 10;
        const height = 6.6;
        const geometry = new PlaneGeometry(width, height, columns, rows);
        const position = geometry.attributes.position as BufferAttribute;
        const positions = position.array as Float32Array;
        const previous = new Float32Array(positions);
        const origin = new Float32Array(positions);
        const pinned = new Uint8Array(positions.length / 3);
        for (let x = 0; x <= columns; x += 1) pinned[x] = 1;
        const constraints = createConstraints(columns, rows, width, height);

        const weave = createWeaveTexture(policy.lowPower);
        const material = new MeshPhysicalMaterial({
          color: 0xe8ebe6,
          map: weave,
          roughness: 0.72,
          metalness: 0,
          sheen: 0.9,
          sheenColor: new Color(0xbfd6dd),
          sheenRoughness: 0.48,
          side: DoubleSide
        });
        const cloth = new Mesh(geometry, material);
        cloth.rotation.z = -0.05;
        scene.add(cloth);

        const shadow = new Mesh(
          new PlaneGeometry(11.5, 7.6),
          new MeshBasicMaterial({ color: 0x17242d, transparent: true, opacity: 0.17 })
        );
        shadow.position.z = -1.25;
        shadow.rotation.z = -0.02;
        scene.add(shadow);

        scene.add(new HemisphereLight(0xf7fbf8, 0x101a22, 2.25));
        const sideLight = new DirectionalLight(0xfffbf4, 4.3);
        sideLight.position.set(-4, 4, 7);
        scene.add(sideLight);
        const seamLight = new DirectionalLight(0xf04f36, 1.4);
        seamLight.position.set(5, -1, 4);
        scene.add(seamLight);

        let accumulator = 0;
        let simulationTime = 0;
        let normalTick = 0;
        let renderedMode = modeRef.current;

        const applyPinned = () => {
          const foldMode = modeRef.current === "fold";
          for (let index = 0; index <= columns; index += 1) {
            const offset = index * 3;
            const normalizedX = index / columns;
            const fold = foldMode ? pageCrease(normalizedX, 0) : 0;
            positions[offset] = origin[offset] * (foldMode ? 0.9 : 1);
            positions[offset + 1] = origin[offset + 1];
            positions[offset + 2] = origin[offset + 2] + fold;
            previous[offset] = positions[offset];
            previous[offset + 1] = positions[offset + 1];
            previous[offset + 2] = positions[offset + 2];
          }
        };

        const simulateStep = () => {
          const foldMode = modeRef.current === "fold";
          const gravity = foldMode ? -0.001 : -0.006;
          const windStrength = foldMode ? 0.006 : 0.011;
          simulationTime += FIXED_STEP;

          for (let index = 0; index < positions.length / 3; index += 1) {
            if (pinned[index]) continue;
            const offset = index * 3;
            const x = positions[offset];
            const y = positions[offset + 1];
            const z = positions[offset + 2];
            const velocityX = (x - previous[offset]) * 0.985;
            const velocityY = (y - previous[offset + 1]) * 0.985;
            const velocityZ = (z - previous[offset + 2]) * 0.982;
            previous[offset] = x;
            previous[offset + 1] = y;
            previous[offset + 2] = z;
            positions[offset] += velocityX;
            positions[offset + 1] += velocityY + gravity;
            positions[offset + 2] += velocityZ + Math.sin(simulationTime * 1.2 + x * 0.65 + y * 0.3) * windStrength;

            if (foldMode) {
              const column = index % (columns + 1);
              const row = Math.floor(index / (columns + 1));
              const u = column / columns;
              const v = row / rows;
              const targetX = origin[offset] * (0.9 + v * 0.1);
              const targetY = origin[offset + 1];
              const targetZ = origin[offset + 2] + pageCrease(u, v);
              positions[offset] += (targetX - positions[offset]) * 0.055;
              positions[offset + 1] += (targetY - positions[offset + 1]) * 0.045;
              positions[offset + 2] += (targetZ - positions[offset + 2]) * 0.075;
            }

            if (pointerActive) {
              const u = x / width + 0.5;
              const v = y / height + 0.5;
              const dx = u - pointer.x;
              const dy = v - pointer.y;
              const distanceSquared = dx * dx + dy * dy;
              if (distanceSquared < 0.045) positions[offset + 2] += (0.045 - distanceSquared) * 2.2;
            }
          }

          for (let iteration = 0; iteration < 3; iteration += 1) {
            for (let index = 0; index < constraints.left.length; index += 1) {
              satisfyConstraint(positions, constraints.left[index], constraints.right[index], constraints.rest[index], pinned);
            }
          }
          applyPinned();
          position.needsUpdate = true;
          if (normalTick % 2 === 0) geometry.computeVertexNormals();
          normalTick += 1;
        };

        const snap = () => {
          const activeMode = modeRef.current;
          renderedMode = activeMode;
          for (let index = 0; index < positions.length / 3; index += 1) {
            const offset = index * 3;
            const column = index % (columns + 1);
            const row = Math.floor(index / (columns + 1));
            const u = column / columns;
            const v = row / rows;
            const fold = activeMode === "fold" ? pageCrease(u, v) : 0;
            const drape = activeMode === "drape" ? Math.sin(u * Math.PI * 2 + v * 0.7) * 0.13 * v : 0;
            positions[offset] = origin[offset] * (activeMode === "fold" ? 0.9 + v * 0.1 : 1);
            positions[offset + 1] = origin[offset + 1] - (activeMode === "drape" ? Math.sin(u * Math.PI) * v * 0.16 : 0);
            positions[offset + 2] = origin[offset + 2] + fold + drape;
            previous[offset] = positions[offset];
            previous[offset + 1] = positions[offset + 1];
            previous[offset + 2] = positions[offset + 2];
          }
          accumulator = 0;
          simulationTime = 0;
          position.needsUpdate = true;
          geometry.computeVertexNormals();
          cloth.rotation.y = activeMode === "inspect" ? -0.18 : 0.02;
          shadow.rotation.y = cloth.rotation.y;
        };

        return {
          scene,
          camera,
          update: (_time, delta) => {
            if (renderedMode !== modeRef.current) snap();
            if (modeRef.current !== "inspect") {
              accumulator = Math.min(accumulator + delta, FIXED_STEP * MAX_STEPS_PER_FRAME);
              let steps = 0;
              while (accumulator >= FIXED_STEP && steps < MAX_STEPS_PER_FRAME) {
                simulateStep();
                accumulator -= FIXED_STEP;
                steps += 1;
              }
            }
            cloth.rotation.y = modeRef.current === "inspect" ? -0.18 : 0.02;
            shadow.rotation.y = cloth.rotation.y;
          },
          snap,
          resize: (screenWidth, screenHeight) => {
            camera.aspect = screenWidth / screenHeight;
            camera.position.z = screenWidth < 620 ? 13.8 : 11.2;
            camera.updateProjectionMatrix();
            renderer.setClearColor(0x000000, 0);
          },
          dispose: () => {
            geometry.dispose();
            material.dispose();
            weave.dispose();
            shadow.geometry.dispose();
            (shadow.material as Material).dispose();
          }
        };
      }
    });
    runtimeRef.current = runtime;

    return () => {
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      runtimeRef.current = null;
      runtime.dispose();
    };
  }, []);

  return (
    <div className="foldline-visual" data-testid="primary-visual">
      <canvas ref={canvasRef} aria-hidden="true" data-testid="primary-canvas" />
      {fallback && (
        <GraphicsFallback
          title="Four authored fabric states"
          description="The static composition preserves drape, fold, seam, and inspection states without continuous physics."
          variant="cloth"
        />
      )}
      <span className="visual-status" aria-live="polite">{fallback || "Choose a construction state; pointer movement is an optional tactile enhancement."}</span>
    </div>
  );
}

export default FoldlineScene;
