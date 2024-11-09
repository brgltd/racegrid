"use client";

import { raceGridNftAbi } from "@/abis";
import { config } from "@/chains";
import { useAppContext } from "@/hooks/use-app-context";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";

export const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "white",
  "black",
  "gray",
];

function getTokenURI(color: string) {
  const prefix =
    process.env.NODE_ENV === "production"
      ? "https://racegrid.vercel.app"
      : "http://localhost:3000";
  const suffix = `/nfts/${color}.json`;
  return `${prefix}${suffix}`;
}

export default function Card() {
  const [color, setColor] = useState("red");

  const { writeContractAsync } = useWriteContract();

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

  const onClickMint = async () => {
    try {
      const hash = await writeContractAsync({
        address: sourceChain?.raceGridNFT,
        abi: raceGridNftAbi,
        functionName: "mint",
        args: [getTokenURI(color)],
        chainId: sourceChain?.definition?.id,
      });
      await waitForTransactionReceipt(config, {
        hash,
        chainId: sourceChain.definition?.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>Choose the color for your car</div>
      <select
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
      >
        {colors.map((colorItem) => (
          <option key={colorItem} value={colorItem}>
            {colorItem}
          </option>
        ))}
      </select>
      <div>Cost: 0.01 ETH</div>
      <button onClick={onClickMint}>mint</button>

      <hr />
      <div>user token: {userToken || "none"}</div>
    </div>
  );
}
