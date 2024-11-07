"use client";

import { raceGridNftAbi } from "@/abis";
import { useAppContext } from "@/hooks/use-app-context";
import { setState } from "@/racing-game-r3f/store";
import Link from "next/link";
import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { colors } from "./nft/page";
import { useGLTF, useTexture } from "@react-three/drei";

useTexture.preload("/textures/heightmap_1024.png");
useGLTF.preload("/models/track-draco.glb");
useGLTF.preload("/models/chassis-draco.glb");
useGLTF.preload("/models/wheel-draco.glb");

export default function HomePage() {
  const { sourceChain, userAddress } = useAppContext();

  const { data: userToken } = useReadContract({
    address: sourceChain?.raceGridNFT,
    abi: raceGridNftAbi,
    functionName: "userToTokenURI",
    // @ts-ignore
    args: [userAddress],
    chainId: sourceChain?.definition?.id,
    query: { enabled: !!sourceChain },
  });

  useEffect(() => {
    const userColor = userToken?.match(/\/(\w+)\.json/)?.[1];
    const isColorValid = userColor && colors.includes(userColor);
    if (isColorValid) {
      setState({ color: userColor });
    }
  }, [userToken]);

  return (
    <div>
      <ul>
        <li>
          <Link href="/challenge">Play Challenge</Link>
        </li>
        <li>
          <Link href="/card">Purchase NFT</Link>
        </li>
        <li>Multiplayer (Coming Soon)</li>
      </ul>

      <div>user token: {userToken || "none"}</div>
    </div>
  );
}
