import { useReadContract } from "wagmi";
import { useAppContext } from "./use-app-context";
import { raceGridNftAbi } from "@/abis";
import { useEffect } from "react";
import { useStore } from "@/racing-game-r3f/store";
import { Address } from "viem";

export function useReadNFT(isEnabled = true) {
  const { sourceChain, userAddress } = useAppContext();

  const [actions] = useStore((s) => [s.actions]);

  const { enableGame } = actions;

  const { data: userToken } = useReadContract({
    address: sourceChain?.raceGridNFT,
    abi: raceGridNftAbi,
    functionName: "userToTokenURI",
    args: [userAddress as Address],
    chainId: sourceChain?.definition?.id,
    query: { enabled: !!sourceChain && isEnabled },
  });

  useEffect(() => {
    enableGame(userToken);
  }, [userToken]);
}
