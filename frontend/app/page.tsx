"use client";

import { raceGridNftAbi } from "@/abis";
import { useAppContext } from "@/hooks/use-app-context";
import { setState, useStore } from "@/racing-game-r3f/store";
import Link from "next/link";
import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { colors } from "./nft/page";
import { useGLTF, useTexture } from "@react-three/drei";
import { useReadNFT } from "@/hooks/use-read-nft";

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
        <li>
          {isGameAllowed ? (
            <Link href="/challenge">Play Challenge</Link>
          ) : (
            <span>Play Challenge</span>
          )}{" "}
          {!isGameAllowed && <span>You must own an NFT to play the game</span>}
        </li>
        <li>
          <Link href="/nft">Purchase NFT</Link>
        </li>
        <li>Multiplayer (Coming Soon)</li>
      </ul>
    </div>
  );
}
