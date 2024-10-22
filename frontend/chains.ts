import { getDefaultWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { bscTestnet, anvil } from "wagmi/chains";
// import { foundry } from "@wagmi/cli/plugins";
import { Address, Chain as Definition } from "viem";
import { Constants } from "@/constants";

export type Chain = {
  chainSelector: number;
  name: string;
  img: number;
  definition: Definition;
  upgradeableBasicNft: Address;
};

type SupportedChainsMap = Record<number, Chain>;

const bscChain = {
  chainSelector: 1007,
  name: "BSC Testnet",
  img: 9195,
  definition: bscTestnet,
  upgradeableBasicNft: Constants.BSCTestnet.UpgradeableBasicNft,
};

const anvilChain = {
  chainSelector: 31337,
  name: "Anvil",
  img: 9195,
  definition: anvil,
  upgradeableBasicNft: Constants.Anvil.UpgradeableBasicNft,
};

const supportedChains: Chain[] = [bscChain, anvilChain];

// const supportedChains: Chain[] = [
//   // bscChain,
//   anvilChain,
// ];

const chainDefinitions = supportedChains.map((chain) => chain.definition) as [
  Definition,
];

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

export const getChainTrasports = () =>
  chainDefinitions.reduce(
    (acc, { id }) => ({
      ...acc,
      [id]: http(),
    }),
    {},
  );

export const wagmiConfig = (() => {
  return getDefaultConfig({
    // TODO: add project name
    appName: "name",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    wallets: [
      ...getDefaultWallets().wallets,
      {
        groupName: "Other",
        wallets: [argentWallet, trustWallet, ledgerWallet],
      },
    ],
    chains: chainDefinitions,
  });
})();

export const config = (() => {
  return createConfig({
    chains: chainDefinitions,
    transports: getChainTrasports(),
  });
})();
