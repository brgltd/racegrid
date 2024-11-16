"use client";

import { raceGridNftAbi } from "@/abis";
import { config } from "@/wagmi";
import { useAppContext } from "@/hooks/use-app-context";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { CircularProgress, MenuItem, TextField } from "@mui/material";
import { Button } from "@/components/button";
import Link from "next/link";
import { useStore } from "@/racing-game-r3f/store";
import { colorOptions } from "@/utils/colors";

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
  const [txLink, setTxLink] = useState("");

  const { writeContractAsync } = useWriteContract();

  const { sourceChain, handleError } = useAppContext();

  const [actions] = useStore((s) => [s.actions]);

  const { enableGame } = actions;

  useEffect(() => {
    document.title = "Race Grid | Mint NFT";
  }, []);

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
      setTxLink(`https://hekla.taikoscan.io/tx/${hash}`);
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId: sourceChain.definition?.id,
      });
      console.log("hash");
      console.log(hash);
      console.log("receipt");
      console.log(receipt);

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
        <div className="flex flex-row items-center mb-10">
          <CircularProgress size={32} />
          <div className="ml-4 txt-xl">Minting in progress</div>
        </div>
      )}

      {isSuccess && !isMinting && (
        <div className="mb-8 text-xl">NFT minted successfully!</div>
      )}

      {txLink && (
        <a
          href={txLink}
          target="_blank"
          className="text-xl mb-8 underline hover:text-blue-400 w-fit transition-all inline-block"
        >
          Open TX
        </a>
      )}

      {isSuccess && !isMinting && (
        <div className="text-xl mb-8 underline hover:text-blue-400 w-fit transition-all">
          <Link href="/challenge">Play Game</Link>
        </div>
      )}
    </div>
  );
}
