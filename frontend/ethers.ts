import { ethers } from "ethers";
import { anvil } from "viem/chains";
import { Constants } from "./constants";
import { leaderboardAbi } from "./abis";

enum Chains {
  Anvil = "ANVIL",
  TaikoTestnet = "TAIKO_TESTNET",
}

export const anvilProviderReadable = new ethers.providers.JsonRpcProvider(
  anvil.rpcUrls.default.http[0],
);

export function getLeaderboardContract(chain: Chains) {
  if (chain === Chains.Anvil) {
    return new ethers.Contract(
      Constants.Anvil.Leaderboard,
      leaderboardAbi,
      anvilProviderReadable,
    );
  }
  if (chain === Chains.TaikoTestnet) {
    // TODO
  }
  throw new Error("undefined chain");
}
