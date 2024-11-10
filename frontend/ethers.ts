import { ethers } from "ethers";
import { anvil } from "viem/chains";
import { Constants } from "./constants";
import { leaderboardAbi } from "./abis";
import { anvilChain } from "./chains";

export const anvilProviderReadable = new ethers.providers.JsonRpcProvider(
  anvil.rpcUrls.default.http[0],
);

export function getLeaderboardContract(chain: string) {
  if (chain === anvilChain.name) {
    return new ethers.Contract(
      Constants.Anvil.Leaderboard,
      leaderboardAbi,
      anvilProviderReadable,
    );
  }
  // TODO: add taiko testnet
  throw new Error("undefined chain");
}
