import debounce from "lodash-es/debounce";
import clamp from "lodash-es/clamp";
import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { useBox } from "@react-three/cannon";
import { useGLTF, PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Color, Vector3, MathUtils } from "three";

import type { PropsWithChildren } from "react";
import type { BoxProps } from "@react-three/cannon";
import type { GLTF } from "three-stdlib";
import type {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PositionalAudio as PositionalAudioImpl,
} from "three";
import type { CollideEvent } from "@react-three/cannon";

import { getState, setState, mutation, useStore } from "../../store";

import type { Camera, Controls } from "../../store";

const { lerp } = MathUtils;

interface ChassisGLTF extends GLTF {
  nodes: {
    Chassis_1: Mesh;
    Chassis_2: Mesh;
    Glass: Mesh;
    BrakeLights: Mesh;
    HeadLights: Mesh;
    Cabin_Grilles: Mesh;
    Undercarriage: Mesh;
    TurnSignals: Mesh;
    Chrome: Mesh;
    Wheel_1: Mesh;
    Wheel_2: Mesh;
    License_1: Mesh;
    License_2: Mesh;
    Cube013: Mesh;
    Cube013_1: Mesh;
    Cube013_2: Mesh;
    "pointer-left": Mesh;
    "pointer-right": Mesh;
  };
  materials: {
    BodyPaint: MeshStandardMaterial;
    License: MeshStandardMaterial;
    Chassis_2: MeshStandardMaterial;
    Glass: MeshStandardMaterial;
    BrakeLight: MeshStandardMaterial;
    defaultMatClone: MeshStandardMaterial;
    HeadLight: MeshStandardMaterial;
    Black: MeshStandardMaterial;
    Undercarriage: MeshStandardMaterial;
    TurnSignal: MeshStandardMaterial;
  };
}

type MaterialMesh = Mesh<BoxBufferGeometry, MeshStandardMaterial>;

const gears = 10;
const c = new Color();
const v = new Vector3();

export const Chassis = forwardRef<Group, PropsWithChildren<BoxProps>>(
  ({ args = [2, 1.1, 4.7], mass = 500, children, ...props }, ref) => {
    const glass = useRef<MaterialMesh>(null!);
    const brake = useRef<MaterialMesh>(null!);
    const wheel = useRef<Group>(null);
    const needle = useRef<MaterialMesh>(null!);
    const chassis_1 = useRef<MaterialMesh>(null!);
    const crashAudio = useRef<PositionalAudioImpl>(null!);
    const [maxSpeed] = useStore((s) => [s.vehicleConfig.maxSpeed]);
    const { nodes: n, materials: m } = useGLTF(
      "/models/chassis-draco.glb",
    ) as ChassisGLTF;

    const onCollide = useCallback(
      debounce<(e: CollideEvent) => void>((e) => {
        if (e.body.userData.trigger || !getState().sound || !crashAudio.current)
          return;
        crashAudio.current.setVolume(
          clamp(e.contact.impactVelocity / 10, 0.2, 1),
        );
        if (!crashAudio.current.isPlaying) crashAudio.current.play();
      }, 200),
      [],
    );

    const [, api] = useBox(
      () => ({ mass, args, allowSleep: false, onCollide, ...props }),
      ref,
    );

    useEffect(() => {
      setState({ api });
      return () => setState({ api: null });
    }, [api]);

    useLayoutEffect(
      () =>
        api.velocity.subscribe((velocity) => {
          const speed = v.set(...velocity).length();
          const gearPosition = speed / (maxSpeed / gears);
          const rpmTarget = Math.max(
            ((gearPosition % 1) + Math.log(gearPosition)) / 6,
            0,
          );
          Object.assign(mutation, { rpmTarget, speed, velocity });
        }),
      [maxSpeed],
    );

    let camera: Camera;
    let controls: Controls;
    useFrame((_, delta) => {
      camera = getState().camera;
      controls = getState().controls;
      brake.current.material.color.lerp(
        c.set(controls.brake ? "#555" : "white"),
        delta * 10,
      );
      brake.current.material.emissive.lerp(
        c.set(controls.brake ? "red" : "red"),
        delta * 10,
      );
      brake.current.material.opacity = lerp(
        brake.current.material.opacity,
        controls.brake ? 1 : 0.3,
        delta * 10,
      );
      glass.current.material.opacity = lerp(
        glass.current.material.opacity,
        camera === "FIRST_PERSON" ? 0.1 : 0.75,
        delta,
      );
      glass.current.material.color.lerp(
        c.set(camera === "FIRST_PERSON" ? "white" : "black"),
        delta,
      );
      if (wheel.current)
        wheel.current.rotation.z = lerp(
          wheel.current.rotation.z,
          controls.left ? -Math.PI : controls.right ? Math.PI : 0,
          delta,
        );
      needle.current.rotation.y =
        (mutation.speed / maxSpeed) * -Math.PI * 2 - 0.9;
      chassis_1.current.material.color.lerp(c.set(getState().color), 0.1);
    });

    return (
      <group ref={ref} dispose={null}>
        <group position={[0, -0.2, -0.2]}>
          <mesh
            ref={chassis_1}
            castShadow
            receiveShadow
            geometry={n.Chassis_1.geometry}
            material={m.BodyPaint}
            material-color="#f0c050"
          />
          <mesh
            castShadow
            geometry={n.Chassis_2.geometry}
            material={n.Chassis_2.material}
            material-color="#353535"
          />
          <mesh
            castShadow
            ref={glass}
            geometry={n.Glass.geometry}
            material={m.Glass}
            material-transparent
          />
          <mesh
            ref={brake}
            geometry={n.BrakeLights.geometry}
            material={m.BrakeLight}
            material-transparent
          />
          <mesh geometry={n.HeadLights.geometry} material={m.HeadLight} />
          <mesh geometry={n.Cabin_Grilles.geometry} material={m.Black} />
          <mesh
            geometry={n.Undercarriage.geometry}
            material={m.Undercarriage}
          />
          <mesh geometry={n.TurnSignals.geometry} material={m.TurnSignal} />
          <mesh geometry={n.Chrome.geometry} material={n.Chrome.material} />
          <group ref={wheel} position={[0.37, 0.25, 0.46]}>
            <mesh geometry={n.Wheel_1.geometry} material={n.Wheel_1.material} />
            <mesh geometry={n.Wheel_2.geometry} material={n.Wheel_2.material} />
          </group>
          <group position={[0, 0, 0]}>
            <mesh geometry={n.License_1.geometry} material={m.License} />
            <mesh
              geometry={n.License_2.geometry}
              material={n.License_2.material}
            />
          </group>
          <group
            position={[0.2245, 0.3045, 0.6806]}
            scale={[0.0594, 0.0594, 0.0594]}
          >
            <mesh geometry={n.Cube013.geometry} material={n.Cube013.material} />
            <mesh
              geometry={n.Cube013_1.geometry}
              material={n.Cube013_1.material}
            />
            <mesh
              geometry={n.Cube013_2.geometry}
              material={n.Cube013_2.material}
            />
          </group>
          <mesh
            geometry={n["pointer-left"].geometry}
            material={n["pointer-left"].material}
            position={[0.5107, 0.3045, 0.6536]}
            rotation={[Math.PI / 2, -1.1954, 0]}
            scale={[0.0209, 0.0209, 0.0209]}
          />
          <mesh
            ref={needle}
            geometry={n["pointer-right"].geometry}
            material={n["pointer-right"].material}
            position={[0.2245, 0.3045, 0.6536]}
            rotation={[-Math.PI / 2, -0.9187, Math.PI]}
            scale={[0.0209, 0.0209, 0.0209]}
          />
        </group>
        {children}
        <PositionalAudio
          ref={crashAudio}
          url="/sounds/crash.mp3"
          loop={false}
          distance={5}
        />
      </group>
    );
  },
);
