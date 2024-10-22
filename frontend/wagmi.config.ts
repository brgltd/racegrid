import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "./abis.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../contracts",
      include: ["UpgradeableBasicNft.sol/**"],
    }),
  ],
});
