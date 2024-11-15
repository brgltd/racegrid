import { ethers } from "ethers";
import { anvil, taikoHekla } from "viem/chains";
import { Constants } from "./constants";
import { leaderboardAbi } from "./abis";
import { anvilChain, taikoTestnetChain } from "./chains";

export function getLeaderboardContract(chain: string) {
  if (chain === anvilChain.name) {
    const anvilProviderReadable = new ethers.providers.JsonRpcProvider(
      anvil.rpcUrls.default.http[0],
    );
    return new ethers.Contract(
      Constants.Anvil.Leaderboard,
      leaderboardAbi,
      anvilProviderReadable,
    );
  }
  if (chain === taikoTestnetChain.name) {
    const taikoTestnetProviderReadable = new ethers.providers.JsonRpcProvider(
      taikoHekla.rpcUrls.default.http[0],
    );
    return new ethers.Contract(
      Constants.TaikoTestnet.Leaderboard,
      leaderboardAbi,
      taikoTestnetProviderReadable,
    );
  }
  throw new Error("undefined chain");
}
