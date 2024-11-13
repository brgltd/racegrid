import { useReadContract } from "wagmi";
import { useAppContext } from "./use-app-context";
import { raceGridNftAbi } from "@/abis";
import { useEffect } from "react";
import { colors } from "@/app/nft/page";
import { setState } from "@/racing-game-r3f/store";
import { Address } from "viem";

export function useReadNFT(isEnabled = true) {
  const { sourceChain, userAddress } = useAppContext();

  const { data: userToken } = useReadContract({
    address: sourceChain?.raceGridNFT,
    abi: raceGridNftAbi,
    functionName: "userToTokenURI",
    args: [userAddress as Address],
    chainId: sourceChain?.definition?.id,
    query: { enabled: !!sourceChain && isEnabled },
  });

  useEffect(() => {
    const userColor = userToken?.match(/\/(\w+)\.json/)?.[1];
    const isColorValid = userColor && colors.includes(userColor);
    if (isColorValid) {
      setState({ color: userColor, isGameAllowed: true });
    }
  }, [userToken]);
}
