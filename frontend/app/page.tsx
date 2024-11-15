"use client";

import { useStore } from "@/racing-game-r3f/store";
import Link from "next/link";
import { useGLTF, useTexture } from "@react-three/drei";
import { useReadNFT } from "@/hooks/use-read-nft";
import { Tooltip } from "@mui/material";
import { useEffect } from "react";

useTexture.preload("/textures/heightmap_1024.png");
useGLTF.preload("/models/track-draco.glb");
useGLTF.preload("/models/chassis-draco.glb");
useGLTF.preload("/models/wheel-draco.glb");

export default function HomePage() {
  const [isGameAllowed] = useStore((s) => [s.isGameAllowed]);
  useReadNFT();

  useEffect(() => {
    document.title = "Race Grid | Home";
  }, []);

  return (
    <div>
      <ul>
        {isGameAllowed ? (
          <li className="text-2xl mb-10 underline hover:text-blue-400 w-fit transition-all">
            <Link href="/challenge">Play Challenge</Link>
          </li>
        ) : (
          <li className="text-2xl mb-10 w-fit">
            <Tooltip
              placement="right"
              title={
                <div style={{ fontSize: 20 }}>
                  Purchase an NFT to play the Race Challenge
                </div>
              }
            >
              <div>Play Challenge</div>
            </Tooltip>
          </li>
        )}
        <li className="text-2xl mb-10 underline hover:text-blue-400 w-fit transition-all">
          <Link href="/nft">Purchase NFT</Link>
        </li>
        <li className="text-2xl mb-8 w-fit">
          <div>Multiplayer (Coming Soon)</div>
        </li>
      </ul>
    </div>
  );
}
