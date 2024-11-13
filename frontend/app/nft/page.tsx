"use client";

import { raceGridNftAbi } from "@/abis";
import { config } from "@/wagmi";
import { useAppContext } from "@/hooks/use-app-context";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { CircularProgress, MenuItem, TextField } from "@mui/material";
import { Button } from "@/components/button";
import Link from "next/link";
import { useStore } from "@/racing-game-r3f/store";

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
  const [color, setColor] = useState(colorOptions[0].value);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { sourceChain, handleError } = useAppContext();

  const [actions] = useStore((s) => [s.actions]);

  const { enableGame } = actions;

  const onClickMint = async () => {
    setIsMinting(true);
    const userToken = buildTokenURI(color);
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
      setIsSuccess(true);
      enableGame(userToken);
    } catch (error) {
      handleError(error);
      setIsSuccess(false);
    }
    setIsMinting(false);
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

      <div className="mb-10">
        <Button
          onClick={onClickMint}
          isDisabled={isMinting}
          styles={{ width: "300px" }}
        >
          Mint NFT
        </Button>
      </div>

      {isMinting && (
        <div className="flex flex-row align-center mb-10">
          <CircularProgress size={20} />
          <div className="ml-4">Minting in progress</div>
        </div>
      )}

      {isSuccess && !isMinting && (
        <ul>
          <li className="mb-8">NFT minted successfully!</li>
          <li className="text-xl mb-10 underline hover:text-blue-400 w-fit transition-all">
            <Link href="/challenge">Play Game</Link>
          </li>
        </ul>
      )}
    </div>
  );
}
