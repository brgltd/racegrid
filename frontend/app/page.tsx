"use client";

import { useStore } from "@/racing-game-r3f/store";
import Link from "next/link";
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
        <li className="text-2xl mb-8">Multiplayer (Coming Soon)</li>
      </ul>
    </div>
  );
}
