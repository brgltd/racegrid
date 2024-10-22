"use client";

import { levelLayer, useStore } from "@/hooks/use-store";
import { ReactNode, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { Layers } from "three";
import {
  Sky,
  Environment,
  PerspectiveCamera,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import type { DirectionalLight } from "three";
import { useToggle } from "@/hooks/use-toggle";

useTexture.preload("/game-assets/textures/heightmap_1024.png");
useGLTF.preload("/game-assets/models/track-draco.glb");
useGLTF.preload("/game-assets/models/chassis-draco.glb");
useGLTF.preload("/game-assets/models/wheel-draco.glb");

// function Intro({ children }: { children: ReactNode }) {
//   return (
//     <>
//       <Suspense fallback={null}>{children}</Suspense>
//       <div>
//         <div>loading intro would go here</div>
//       </div>
//     </>
//   );
// }

const layers = new Layers();
layers.enable(levelLayer);

export function Game() {
  const [light, setLight] = useState<DirectionalLight | null>(null);
  const [dpr, shadows, editor] = useStore((s) => [s.dpr, s.shadows, s.editor]);

  const ToggledOrbitControls = useToggle(OrbitControls, "editor");

  return (
    <div>
      <div>the game</div>
      <img src="/game-assets/images/bronze.png" width={100} height={100} />
      {/* <img src="../game-assets/images/bronze.png" width={100} height={100} /> */}
      <Canvas
        key={`${dpr}${shadows}`}
        dpr={[1, dpr]}
        shadows={shadows}
        camera={{ position: [0, 5, 15], fov: 50 }}
      >
        <fog attach="fog" args={["white", 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} distance={1000} />
        <ambientLight layers={layers} intensity={0.1} />
        <directionalLight
          ref={setLight}
          layers={layers}
          position={[0, 50, 150]}
          intensity={1}
          shadow-bias={-0.001}
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
          castShadow
        />
        <PerspectiveCamera
          makeDefault={editor}
          fov={75}
          position={[0, 20, 20]}
        />
      </Canvas>
    </div>
  );
}
