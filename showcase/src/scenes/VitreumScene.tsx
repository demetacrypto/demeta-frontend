import { useEffect, useRef, useState } from "react";
import {
  BufferGeometry,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  ShaderMaterial,
  TorusGeometry,
  Vector2,
  Vector3
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GraphicsFallback } from "../components/GraphicsFallback";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { disposeObject, mountThreeScene, type MountedThreeScene, type SceneController } from "../graphics/runtime";

export type VitreumLayer = "shell" | "logic" | "power";

type Props = Readonly<{ activeLayer: VitreumLayer }>;

const glassVertexShader = `
  varying vec3 vViewNormal;
  varying vec3 vWorldPosition;

  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const glassFragmentShader = `
  precision highp float;
  varying vec3 vViewNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float facing = abs(dot(normalize(vViewNormal), viewDirection));
    float fresnel = pow(1.0 - facing, 2.35);
    float internalGlow = pow(1.0 - facing, 5.0);
    vec3 glassBase = vec3(0.58, 0.86, 0.86);
    vec3 rim = vec3(0.96, 1.0, 0.99);
    vec3 dispersionHint = vec3(0.16, 0.04, 0.0) * internalGlow;
    vec3 color = mix(glassBase, rim, fresnel) + dispersionHint;
    gl_FragColor = vec4(color, 0.10 + fresnel * 0.64);
  }
`;

export function VitreumScene({ activeLayer }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<MountedThreeScene | null>(null);
  const activeLayerRef = useRef(activeLayer);
  const reducedMotion = useReducedMotion();
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    activeLayerRef.current = activeLayer;
    runtimeRef.current?.invalidate();
  }, [activeLayer]);

  useEffect(() => {
    runtimeRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const pointer = new Vector2(0.08, -0.06);

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 0.5, -0.28, 0.28),
        MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 0.35, -0.2, 0.2)
      );
      runtimeRef.current?.invalidate();
    };
    canvas.addEventListener("pointermove", onPointer);

    const runtime = mountThreeScene(canvas, {
      reducedMotion,
      onFallback: setFallback,
      create: (renderer, policy): SceneController => {
        const scene = new Scene();
        const camera = new PerspectiveCamera(34, 1, 0.1, 50);
        camera.position.set(0, 0.15, 11.5);

        const device = new Group();
        device.rotation.set(-0.04, -0.22, 0.08);
        scene.add(device);

        const shellGeometry = new RoundedBoxGeometry(3.5, 6.8, 0.86, policy.lowPower ? 4 : 8, 0.42);
        const shellMaterial = new ShaderMaterial({
          vertexShader: glassVertexShader,
          fragmentShader: glassFragmentShader,
          transparent: true,
          depthWrite: false,
          side: DoubleSide
        });
        const shell = new Mesh(shellGeometry, shellMaterial);
        shell.renderOrder = 4;
        device.add(shell);

        const screenGeometry = new RoundedBoxGeometry(2.85, 5.88, 0.1, policy.lowPower ? 3 : 5, 0.3);
        const screenMaterial = new MeshBasicMaterial({
          color: 0x102121,
        });
        const screen = new Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.17;
        device.add(screen);

        const fastenerGeometry = new CylinderGeometry(0.075, 0.075, 0.075, policy.lowPower ? 10 : 18);
        const fastenerMaterial = new MeshBasicMaterial({ color: 0xc9dbd8 });
        const fasteners = new InstancedMesh(fastenerGeometry, fastenerMaterial, 4);
        const fastenerMatrix = new Matrix4();
        const fastenerRotation = new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0));
        const fastenerScale = new Vector3(1, 1, 1);
        [
          [-1.32, 2.62, 0.59],
          [1.32, 2.62, 0.59],
          [-1.32, -2.62, 0.59],
          [1.32, -2.62, 0.59]
        ].forEach(([x, y, z], index) => {
          fastenerMatrix.compose(new Vector3(x, y, z), fastenerRotation, fastenerScale);
          fasteners.setMatrixAt(index, fastenerMatrix);
        });
        device.add(fasteners);

        const powerGroup = new Group();
        powerGroup.userData.layer = "power";
        const batteryGeometry = new RoundedBoxGeometry(1.72, 3.45, 0.24, policy.lowPower ? 2 : 4, 0.18);
        const batteryMaterial = new MeshBasicMaterial({ color: 0xff5a3d });
        const battery = new Mesh(batteryGeometry, batteryMaterial);
        battery.position.set(0.15, -0.65, 0.34);
        powerGroup.add(battery);
        device.add(powerGroup);

        const logicGroup = new Group();
        logicGroup.userData.layer = "logic";
        const logicPlate = new Mesh(
          new RoundedBoxGeometry(2.15, 1.2, 0.16, policy.lowPower ? 2 : 4, 0.14),
          new MeshBasicMaterial({ color: 0x2c7481 })
        );
        logicPlate.position.set(-0.05, 1.85, 0.38);
        logicGroup.add(logicPlate);
        const traceMaterial = new LineBasicMaterial({ color: 0xa8f5df, transparent: true, opacity: 0.8 });
        const tracePoints = [
          -1.0, 2.1, 0.5, 0.1, 2.1, 0.5,
          0.1, 2.1, 0.5, 0.1, 1.5, 0.5,
          0.1, 1.5, 0.5, 0.85, 1.5, 0.5,
          -0.8, 1.7, 0.5, -0.3, 1.7, 0.5,
          -0.3, 1.7, 0.5, -0.3, 1.25, 0.5
        ];
        const traceGeometry = new BufferGeometry();
        traceGeometry.setAttribute("position", new Float32BufferAttribute(tracePoints, 3));
        logicGroup.add(new LineSegments(traceGeometry, traceMaterial));
        device.add(logicGroup);

        const connectorGeometry = new BufferGeometry().setFromPoints([
          new Vector3(-0.62, 1.25, 0.54),
          new Vector3(-0.62, 0.56, 0.54),
          new Vector3(0.15, 0.56, 0.54),
          new Vector3(0.15, 1.08, 0.54)
        ]);
        const connectorMaterial = new LineDashedMaterial({ color: 0xff7657, dashSize: 0.12, gapSize: 0.075 });
        const connector = new Line(connectorGeometry, connectorMaterial);
        connector.computeLineDistances();
        device.add(connector);

        const latch = new Mesh(
          new TorusGeometry(0.18, 0.045, policy.lowPower ? 8 : 12, policy.lowPower ? 20 : 32, Math.PI * 1.5),
          new MeshBasicMaterial({ color: 0xf3fbf8 })
        );
        latch.position.set(0.15, 1.08, 0.58);
        latch.rotation.z = Math.PI * 0.25;
        device.add(latch);

        const opticGroup = new Group();
        opticGroup.userData.layer = "shell";
        const lensMaterial = new MeshBasicMaterial({
          color: 0xb3d6ff,
          transparent: true,
          opacity: 0.62
        });
        const lens = new Mesh(new CylinderGeometry(0.38, 0.38, 0.3, policy.lowPower ? 24 : 48), lensMaterial);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, 2.42, 0.58);
        opticGroup.add(lens);
        device.add(opticGroup);

        const halo = new Mesh(
          new TorusGeometry(3.2, 0.055, policy.lowPower ? 6 : 10, policy.lowPower ? 64 : 110),
          new MeshBasicMaterial({ color: 0xff6b4a, transparent: true, opacity: 0.72 })
        );
        halo.position.z = -1.7;
        halo.rotation.x = 0.32;
        halo.rotation.y = 0.15;
        scene.add(halo);

        const floor = new Mesh(
          new CircleGeometry(4.4, policy.lowPower ? 48 : 80),
          new MeshBasicMaterial({ color: 0xb5dfdd, transparent: true, opacity: 0.12 })
        );
        floor.position.set(0, -4.1, -1.4);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        const layerGroups = [powerGroup, logicGroup, opticGroup];
        const targetRotation = new Vector2(device.rotation.y, device.rotation.x);

        const applyState = (interpolation: number, time = 0) => {
          const layer = activeLayerRef.current;
          layerGroups.forEach((group) => {
            const active = group.userData.layer === layer;
            const target = active ? 1 : 0.62;
            const scale = MathUtils.lerp(group.scale.x, target, interpolation);
            group.scale.setScalar(scale);
            group.position.z = MathUtils.lerp(group.position.z, active ? 0.28 : 0, interpolation);
          });
          targetRotation.set(-0.22 + pointer.x, -0.04 + pointer.y);
          device.rotation.y = MathUtils.lerp(device.rotation.y, targetRotation.x, interpolation);
          device.rotation.x = MathUtils.lerp(device.rotation.x, targetRotation.y, interpolation);
          device.position.y = Math.sin(time * 0.55) * 0.09;
          halo.rotation.z = time * 0.05;
        };

        return {
          scene,
          camera,
          update: (time, delta) => {
            applyState(Math.min(1, delta * 7), time);
          },
          snap: () => applyState(1, 0),
          resize: (width, height) => {
            camera.aspect = width / height;
            camera.position.z = width < 620 ? 13.6 : 11.5;
            camera.updateProjectionMatrix();
            renderer.setClearColor(0x000000, 0);
          },
          dispose: () => {
            disposeObject(scene);
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
    <div className="vitreum-visual" data-testid="primary-visual">
      <canvas ref={canvasRef} aria-hidden="true" data-testid="primary-canvas" />
      {fallback && (
        <GraphicsFallback
          title="Repairable layer map"
          description="A static optical cutaway labels the shell, logic plane, and replaceable power cell."
          variant="glass"
        />
      )}
      <span className="visual-status" aria-live="polite">{fallback || "Move across the object or choose a repair layer below."}</span>
    </div>
  );
}

export default VitreumScene;
