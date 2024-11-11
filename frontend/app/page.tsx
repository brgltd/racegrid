"use client";

import { useStore } from "@/racing-game-r3f/store";
import Link from "next/link";
import { useGLTF, useTexture } from "@react-three/drei";
import { useReadNFT } from "@/hooks/use-read-nft";
import { Tooltip } from "@mui/material";

useTexture.preload("/textures/heightmap_1024.png");
useGLTF.preload("/models/track-draco.glb");
useGLTF.preload("/models/chassis-draco.glb");
useGLTF.preload("/models/wheel-draco.glb");

export default function HomePage() {
  const [isGameAllowed] = useStore((s) => [s.isGameAllowed]);
  useReadNFT();
  return (
    <div>
      <ul>
        <li className="text-2xl mb-8">
          {isGameAllowed ? (
            <Link
              href="/challenge"
              className="underline hover:text-blue-400 w-fit transition-all"
            >
              Play Challenge
            </Link>
          ) : (
            // <span>Play Challenge</span>
            <span>Play Challenge</span>
          )}{" "}
          {!isGameAllowed && <span>You must own an NFT to play the game</span>}
        </li>
        <li className="text-2xl mb-8 underline hover:text-blue-400 w-fit transition-all">
          <Link href="/nft">Purchase NFT</Link>
        </li>
        <li className="text-2xl mb-8 w-fit">
          <Tooltip
            placement="right"
            title={
              <h1 style={{ fontSize: 20 }}>
                Racing multiplayer games will be available shortly
              </h1>
            }
          >
            <div>Multiplayer (Coming Soon)</div>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
}
