import { DoubleSide } from "three";
import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  PositionalAudio,
  useGLTF,
} from "@react-three/drei";

import type { GLTF } from "three-stdlib";
import type { Group, Mesh, MeshStandardMaterial } from "three";

import { useStore, levelLayer } from "../../store";
import { useToggle } from "../../useToggle";

interface TrackGLTF extends GLTF {
  nodes: {
    track_2: Mesh;
    tube: Mesh;
    strip: Mesh;
    track_1: Mesh;
    mountains: Mesh;
    terrain: Mesh;
    water: Mesh;
    bird001: Mesh;
    bird002: Mesh;
    bird003: Mesh;
    bird: Mesh;
    blade001: Mesh;
    blade002: Mesh;
    blade003: Mesh;
    blade004: Mesh;
    blade005: Mesh;
    blade006: Mesh;
    blade: Mesh;
    cloud001: Mesh;
    cloud002: Mesh;
    cloud003: Mesh;
    cloud004: Mesh;
    cloud005: Mesh;
    cloud006: Mesh;
    cloud007: Mesh;
    cloud008: Mesh;
    cloud009: Mesh;
    cloud010: Mesh;
    cloud011: Mesh;
    cloud012: Mesh;
    cloud: Mesh;
  };
  materials: {
    ColorPaletteWater: MeshStandardMaterial;
    "Material.001": MeshStandardMaterial;
    default: MeshStandardMaterial;
  };
}

export function Track(): JSX.Element {
  const level = useStore((state) => state.level);
  const { nodes: n, materials: m } = useGLTF(
    "/models/track-draco.glb",
  ) as TrackGLTF;
  const config = {
    receiveShadow: true,
    castShadow: true,
    "material-roughness": 1,
  };
  const birds = useRef<Group>(null!);
  const clouds = useRef<Group>(null!);

  useLayoutEffect(
    () =>
      void level.current?.traverse((child) => child.layers.enable(levelLayer)),
    [],
  );
  useFrame((_, delta) => {
    birds.current.children.forEach(
      (bird, index) => (bird.rotation.y += delta / index),
    );
    clouds.current.children.forEach(
      (cloud, index) => (cloud.rotation.y += delta / 25 / index),
    );
  });

  const ToggledPositionalAudio = useToggle(PositionalAudio, ["ready", "sound"]);

  return (
    <group dispose={null}>
      <mesh
        geometry={n.track_2.geometry}
        material={m["Material.001"]}
        {...config}
      />
      <mesh geometry={n.tube.geometry} material={m["default"]} {...config} />
      <group ref={level}>
        <mesh
          geometry={n.strip.geometry}
          material={n.strip.material}
          {...config}
        />
        <mesh
          geometry={n.track_1.geometry}
          material={n.track_1.material}
          {...config}
        />
        <mesh
          geometry={n.mountains.geometry}
          material={n.mountains.material}
          {...config}
        />
        <mesh
          geometry={n.terrain.geometry}
          material={n.terrain.material}
          {...config}
        />
        <mesh geometry={n.water.geometry}>
          <MeshDistortMaterial
            speed={4}
            map={m.ColorPaletteWater.map}
            roughness={0}
            side={DoubleSide}
          />
          <ToggledPositionalAudio
            url="/sounds/water.mp3"
            loop
            autoplay
            distance={10}
          />
        </mesh>
      </group>
      <group ref={birds}>
        <mesh
          geometry={n.bird001.geometry}
          material={n.bird001.material}
          {...config}
        />
        <mesh
          geometry={n.bird002.geometry}
          material={n.bird002.material}
          {...config}
        />
        <mesh
          geometry={n.bird003.geometry}
          material={n.bird003.material}
          {...config}
        />
        <mesh
          geometry={n.bird.geometry}
          material={n.bird.material}
          {...config}
        />
      </group>
      <mesh
        geometry={n.blade001.geometry}
        material={n.blade001.material}
        {...config}
      />
      <mesh
        geometry={n.blade002.geometry}
        material={n.blade002.material}
        {...config}
      />
      <mesh
        geometry={n.blade003.geometry}
        material={n.blade003.material}
        {...config}
      />
      <mesh
        geometry={n.blade004.geometry}
        material={n.blade004.material}
        {...config}
      />
      <mesh
        geometry={n.blade005.geometry}
        material={n.blade005.material}
        {...config}
      />
      <mesh
        geometry={n.blade006.geometry}
        material={n.blade006.material}
        {...config}
      />
      <mesh
        geometry={n.blade.geometry}
        material={n.blade.material}
        {...config}
      />
      <group ref={clouds}>
        <mesh
          geometry={n.cloud001.geometry}
          material={n.cloud001.material}
          position={[-8.55, 27.94, -7.84]}
          rotation={[0, 0.26, 0]}
        />
        <mesh
          geometry={n.cloud003.geometry}
          material={n.cloud003.material}
          position={[-8.55, 7.47, -7.84]}
        />
        <mesh
          geometry={n.cloud006.geometry}
          material={n.cloud006.material}
          position={[-43, 11.66, 8.15]}
        />
        <mesh
          geometry={n.cloud008.geometry}
          material={n.cloud008.material}
          position={[16.29, 8.22, -7.84]}
        />
        <mesh
          geometry={n.cloud010.geometry}
          material={n.cloud010.material}
          position={[6.63, 7.79, -7.84]}
        />
        <mesh
          geometry={n.cloud011.geometry}
          material={n.cloud011.material}
          position={[-8.55, -8.74, -7.84]}
        />
        <mesh
          geometry={n.cloud002.geometry}
          material={n.cloud002.material}
          position={[49.41, 27.94, -17.5]}
          rotation={[-Math.PI, 0.92, -Math.PI]}
        />
        <mesh
          geometry={n.cloud004.geometry}
          material={n.cloud004.material}
          position={[10.77, 11.73, 17]}
          rotation={[-Math.PI, 1.19, -Math.PI]}
        />
        <mesh
          geometry={n.cloud012.geometry}
          material={n.cloud012.material}
          position={[11.47, -16.12, -66.08]}
          rotation={[-Math.PI, 0.92, -Math.PI]}
        />
        <mesh
          geometry={n.cloud007.geometry}
          material={n.cloud007.material}
          position={[-8.55, 22.81, -7.84]}
          rotation={[Math.PI, -1.43, Math.PI]}
        />
        <mesh
          geometry={n.cloud009.geometry}
          material={n.cloud009.material}
          position={[-32.93, 17.92, -7.84]}
          rotation={[Math.PI, -0.79, Math.PI]}
        />
        <mesh
          geometry={n.cloud.geometry}
          material={n.cloud.material}
          position={[-66.73, -4.76, -17.35]}
          rotation={[Math.PI, -0.79, Math.PI]}
        />
        <mesh
          geometry={n.cloud005.geometry}
          material={n.cloud005.material}
          position={[25.95, 27.94, -23.02]}
          rotation={[-Math.PI, 0.31, -Math.PI]}
        />
      </group>
    </group>
  );
}
