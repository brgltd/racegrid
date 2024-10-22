import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, PositionalAudio } from "@react-three/drei";
import { useBox } from "@react-three/cannon";

import type { BoxProps } from "@react-three/cannon";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";

import { useToggle } from "../../useToggle";

interface TrainGLTF extends GLTF {
  nodes: {
    train_1: Mesh;
    train_2: Mesh;
    train_3: Mesh;
    train_4: Mesh;
    train_5: Mesh;
    train_6: Mesh;
    train_7: Mesh;
    train_8: Mesh;
    train_9: Mesh;
  };
  materials: {
    custom7Clone: MeshStandardMaterial;
    blueSteelClone: MeshStandardMaterial;
    custom12Clone: MeshStandardMaterial;
    custom14Clone: MeshStandardMaterial;
    glassClone: MeshStandardMaterial;
    defaultMatClone: MeshStandardMaterial;
    steelClone: MeshStandardMaterial;
    lightRedClone: MeshStandardMaterial;
    darkClone: MeshStandardMaterial;
  };
}

export function Train({
  args = [38, 8, 10],
  position = [-145.84, 3.42, 54.67],
  rotation = [0, -0.09, 0],
}: BoxProps): JSX.Element {
  const ref = useRef<Group>(null!);
  const {
    animations,
    nodes: n,
    materials: m,
  } = useGLTF("/models/track-draco.glb") as TrainGLTF;
  const [, api] = useBox(
    () => ({ mass: 10000, type: "Kinematic", args, position, rotation }),
    ref,
    [args, position, rotation],
  );
  const { actions } = useAnimations(animations, ref);
  const config = {
    receiveShadow: true,
    castShadow: true,
    "material-roughness": 1,
  };

  useLayoutEffect(() => void actions.train?.play(), [actions]);
  useFrame(() => {
    api.position.set(
      ref.current.position.x,
      ref.current.position.y,
      ref.current.position.z,
    );
    api.rotation.set(
      ref.current.rotation.x,
      ref.current.rotation.y - 0.09,
      ref.current.rotation.z,
    );
  });

  const ToggledPositionalAudio = useToggle(PositionalAudio, ["ready", "sound"]);

  return (
    <group
      ref={ref}
      name="train"
      position={position}
      rotation={rotation}
      dispose={null}
    >
      <mesh
        geometry={n.train_1.geometry}
        material={m.custom7Clone}
        {...config}
      />
      <mesh
        geometry={n.train_2.geometry}
        material={m.blueSteelClone}
        {...config}
      />
      <mesh
        geometry={n.train_3.geometry}
        material={m.custom12Clone}
        {...config}
      />
      <mesh
        geometry={n.train_4.geometry}
        material={m.custom14Clone}
        {...config}
      />
      <mesh
        geometry={n.train_5.geometry}
        material={m.defaultMatClone}
        {...config}
      />
      <mesh geometry={n.train_6.geometry} material={m.glassClone} {...config} />
      <mesh geometry={n.train_7.geometry} material={m.steelClone} {...config} />
      <mesh
        geometry={n.train_8.geometry}
        material={m.lightRedClone}
        {...config}
      />
      <mesh geometry={n.train_9.geometry} material={m.darkClone} {...config} />
      <ToggledPositionalAudio
        url="/sounds/train.mp3"
        loop
        autoplay
        distance={5}
      />
    </group>
  );
}
