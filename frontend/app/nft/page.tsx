"use client";

import { raceGridNftAbi } from "@/abis";
import { config } from "@/wagmi";
import { useAppContext } from "@/hooks/use-app-context";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { MenuItem, TextField } from "@mui/material";
import { Button } from "@/components/button";

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
  const [color, setColor] = useState(() => colorOptions[0].value);

  const { writeContractAsync } = useWriteContract();

  const { sourceChain, handleError } = useAppContext();

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
      handleError(error);
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
          sx={{ width: "300px" }}
        >
          {colorOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <Button
        onClick={onClickMint}
        isDisabled={false}
        styles={{ width: "300px" }}
      >
        Mint NFT
      </Button>
    </div>
  );
}
