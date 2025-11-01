"use client";

import { useStore } from "@/racing-game-r3f/store";
import Link from "next/link";
import { useGLTF, useTexture } from "@react-three/drei";
import { useReadNFT } from "@/hooks/use-read-nft";
import { Skeleton, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { Address } from "viem";
import { useAppContext } from "@/hooks/use-app-context";

useTexture.preload("/textures/heightmap_1024.png");
useGLTF.preload("/models/track-draco.glb");
useGLTF.preload("/models/chassis-draco.glb");
useGLTF.preload("/models/wheel-draco.glb");

function PlayChallenge({
  isGameAllowed,
  isPendingUserToken,
  userAddress,
  isClient,
}: {
  isGameAllowed: boolean;
  isPendingUserToken: boolean;
  userAddress: Address | undefined;
  isClient: boolean;
}) {
  if (!isClient || (isPendingUserToken && userAddress)) {
    return (
      <div className="mb-10">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={180}
          height={40}
        />
      </div>
    );
  }
  if (!isGameAllowed) {
    return (
      <div className="text-2xl mb-10 w-fit">
        <Tooltip
          placement="right"
          title={
            <div style={{ fontSize: 20 }}>
              Purchase an NFT to play the Race Challenge
            </div>
          }
        >
          <div>Play Challenge (NFT)</div>
        </Tooltip>
      </div>
    );
  }
  return (
    <div className="text-2xl mb-10 underline hover:text-blue-400 w-fit transition-colors">
      <Link href="/challenge">Play Challenge (NFT)</Link>
    </div>
  );
}

export default function HomePage() {
  const [isGameAllowed] = useStore((s) => [s.isGameAllowed]);

  const { isPendingUserToken } = useReadNFT();

  const { userAddress, isClient } = useAppContext();

  useEffect(() => {
    document.title = "Race Grid | Home";
  }, []);

  return (
    <div>
      <div>
				<div className="text-2xl mb-10 underline hover:text-blue-400 w-fit transition-colors">
					<Link href="/challenge">Play Game</Link>
				</div>
        <div className="text-2xl mb-10 underline hover:text-blue-400 w-fit transition-colors">
          <Link href="/nft">Purchase NFT</Link>
        </div>
        <div className="text-2xl mb-8 w-fit">
          <div>Multiplayer (Coming Soon)</div>
        </div>
        <PlayChallenge
          {...{ isGameAllowed, isPendingUserToken, userAddress, isClient }}
        />
      </div>
    </div>
  );
}
