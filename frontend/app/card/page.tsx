"use client";

import { raceGridNftAbi } from "@/abis";
import { config } from "@/chains";
import { Constants } from "@/constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { useWriteContract } from "wagmi";

const colors = [
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
  return `http://localhost:3000/nfts/${color}.png`;
}

export default function Card() {
  const [color, setColor] = useState("");

  const { writeContractAsync } = useWriteContract();

  const onClickMint = async () => {
    try {
      const hash = await writeContractAsync({
        address: Constants.Anvil.RaceGridNFT,
        abi: raceGridNftAbi,
        functionName: "mint",
        args: [getTokenURI(color)],
      });
      await waitForTransactionReceipt(config, {
        hash,
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
    </div>
  );
}
