"use client";

import { upgradeableBasicNftAbi } from "@/abis";
import { useAppContext } from "@/hooks/use-app-context";
import { useReadContract } from "wagmi";

export default function PokePage() {
  const { sourceChain } = useAppContext();

  const { data } = useReadContract({
    address: sourceChain?.upgradeableBasicNft,
    abi: upgradeableBasicNftAbi,
    functionName: "poke",
    query: { enabled: !!sourceChain },
  });

  return (
    <div>
      <div>test the contract, proxy, etc.</div>
      <div>data: {data || "n/a"}</div>
    </div>
  );
}
