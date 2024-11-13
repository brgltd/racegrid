"use client";

import { raceGridNftAbi } from "@/abis";
import { config } from "@/wagmi";
import { useAppContext } from "@/hooks/use-app-context";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { MenuItem, TextField } from "@mui/material";

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

const colorOptions = colors.map((color) => ({
  value: color,
  label: `${color[0].toUpperCase()}${color.slice(1)}`,
}));

function buildTokenURI(color: string) {
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
    args: [userAddress as Address],
    chainId: sourceChain?.definition?.id,
    query: { enabled: !!sourceChain },
  });

  const onClickMint = async () => {
    try {
      const hash = await writeContractAsync({
        address: sourceChain?.raceGridNFT,
        abi: raceGridNftAbi,
        functionName: "mint",
        args: [buildTokenURI(color)],
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
      <div className="text-2xl mb-10">Choose a color for your NFT Car</div>
      <div className="mb-10">
        <TextField
          id="car-color"
          select
          label="Car Color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          sx={{ width: "350px" }}
        >
          {colorOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <button onClick={onClickMint}>mint</button>
    </div>
  );
}
