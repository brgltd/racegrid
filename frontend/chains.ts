import { anvil, taikoHekla } from "wagmi/chains";
import { Address, Chain as Definition } from "viem";
import { Constants } from "@/constants";

export type Chain = {
  chainSelector: number;
  name: string;
  img: number;
  definition: Definition;
  raceGridNFT: Address;
  leaderboard: Address;
};

type SupportedChainsMap = Record<number, Chain>;

export const anvilChain = {
  chainSelector: 31337,
  name: "Anvil",
  img: 9195,
  definition: anvil,
  raceGridNFT: Constants.Anvil.RaceGridNFT,
  leaderboard: Constants.Anvil.Leaderboard,
};

export const taikoTestnetChain = {
  chainSelector: 167009,
  name: "Taiko Hekla L2",
  img: 0,
  definition: taikoHekla,
  raceGridNFT: Constants.TaikoTestnet.RaceGridNFT,
  leaderboard: Constants.TaikoTestnet.Leaderboard,
};

const supportedChains: Chain[] = [
  process.env.NODE_ENV === "production" ? taikoTestnetChain : anvilChain,
];

export const chainDefinitions = supportedChains.map(
  (chain) => chain.definition,
) as [Definition];

export const supportedChainsMap = supportedChains.reduce(
  (acc: SupportedChainsMap, curr) => {
    acc[curr.definition.id] = curr;
    return acc;
  },
  {},
);

export const supportedChainsMapBySelector = supportedChains.reduce(
  (acc: SupportedChainsMap, curr) => {
    acc[curr.chainSelector] = curr;
    return acc;
  },
  {},
);
