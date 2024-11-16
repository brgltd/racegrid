import { useEffect, useState } from "react";
import { Layers } from "three";
import { Canvas } from "@react-three/fiber";
import { Physics, Debug, usePlane, useBox, Triplet } from "@react-three/cannon";
import {
  Sky,
  Environment,
  PerspectiveCamera,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { Keyboard } from "./controls";
import { Cameras } from "./effects";
import { BoundingBox, Track, Vehicle, Goal, Heightmap } from "./models";
import {
  angularVelocity,
  levelLayer,
  position,
  rotation,
  useStore,
} from "./store";
import {
  Checkpoint,
  Speed,
  Minimap,
  Intro,
  Help,
  Editor,
  PickColor,
} from "./ui";
import { useToggle } from "./useToggle";
import type { DirectionalLight } from "three";
import { usePathname, useRouter } from "next/navigation";
import { Clock } from "./ui/Clock";
import { CircularProgress } from "@mui/material";

const layers = new Layers();
layers.enable(levelLayer);

function Plane() {
  usePlane(() => ({
    type: "Static",
    material: "ground",
    rotation: [-Math.PI / 2, 0, 0],
    userData: { id: "floor" },
  }));
  return null;
}

function Carpet() {
  const args: Triplet = [20, 0.5, 19];
  const position: Triplet = [60, 0, 134];
  const rotation: Triplet = [0, Math.PI / 7, 0];
  const [ref] = useBox(() => ({
    mass: 0,
    args,
    position,
    rotation,
  }));
  const color = "rgb(172, 82, 41)";
  return (
    // @ts-ignore
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function RacingGameR3F(): JSX.Element {
  const [light, setLight] = useState<DirectionalLight | null>(null);
  const [shouldResetClock, setShouldResetClock] = useState(false);
  const [isRaceFinished, setIsRaceFinished] = useState(false);

  const [actions, dpr, editor, shadows] = useStore((s) => [
    s.actions,
    s.dpr,
    s.editor,
    s.shadows,
  ]);

  const { onStart, onFinish } = actions;

  const router = useRouter();
  const pathname = usePathname();

  const ToggledCheckpoint = useToggle(Checkpoint, "checkpoint");
  const ToggledDebug = useToggle(Debug, "debug");
  const ToggledEditor = useToggle(Editor, "editor");
  const ToggledMap = useToggle(Minimap, "map");
  const ToggledOrbitControls = useToggle(OrbitControls, "editor");
  const ToggledStats = useToggle(Stats, "stats");

  const onFinishRace = () => {
    onFinish();
    setShouldResetClock(true);
    setIsRaceFinished(true);
    router.push("/leaderboard");
  };

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (pathname === "/challenge" && e.key === "q") {
        router.push("/");
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  });

  if (isRaceFinished) {
    return (
      <div className="redirecting">
        <div className="redirecting-text">Redirecting</div>
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="game">
      <Intro>
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
          <Physics
            allowSleep
            broadphase="SAP"
            defaultContactMaterial={{
              contactEquationRelaxation: 4,
              friction: 1e-3,
            }}
          >
            <ToggledDebug scale={1.0001} color="white">
              <Vehicle
                angularVelocity={[...angularVelocity]}
                position={[...position]}
                rotation={[...rotation]}
              >
                {light && <primitive object={light.target} />}
                <Cameras />
              </Vehicle>

              <Carpet />

              <Heightmap
                elementSize={0.5085}
                position={[327 - 66.5, -3.3, -473 + 213]}
                rotation={[-Math.PI / 2, 0, -Math.PI]}
              />

              <Plane />

              <Goal
                args={[0.001, 10, 18]}
                onCollideBegin={onStart}
                rotation={[0, 0.55, 0]}
                position={[-27, 1, 180]}
              />

              <Goal
                args={[0.001, 10, 18]}
                onCollideBegin={onFinishRace}
                rotation={[0, -1.2, 0]}
                position={[-104, 1, -189]}
              />

              <BoundingBox
                {...{
                  depth: 512,
                  height: 100,
                  position: [0, 40, 0],
                  width: 512,
                }}
              />
            </ToggledDebug>
          </Physics>
          <Track />
          <Environment files="textures/dikhololo_night_1k.hdr" />
          <ToggledMap />
          <ToggledOrbitControls />
        </Canvas>
        <Clock shouldReset={shouldResetClock} />
        <ToggledEditor />
        <Help />
        <Speed />
        <ToggledStats />
        <ToggledCheckpoint />
        <PickColor />
        <Keyboard />
      </Intro>
    </div>
  );
}
