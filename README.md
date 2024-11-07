## Scripts for local

Inside the `contracts/` folder

```bash
cp .env.example .env
```

```bash
source .env
```

### Deploy the proxy

```bash
forge script script/DeployUpgradeableBasicNft.s.sol:DeployUpgradeableBasicNft --rpc-url $LOCAL_ANVIL_RPC_URL --broadcast -vvvv
```

Then, copy the proxy address in .env UPGRADEABLE_BASIC_NFT_PROXY_ADDRESS

### Update the implementation

```bash
forge script script/UpdateUpgradeableBasicNft.s.sol:UpdateUpgradeableBasicNft --rpc-url $LOCAL_ANVIL_RPC_URL --broadcast -vvvv
```

### Mint NFT

```bash
forge script script/MintUpgradeableBasicNft.s.sol:MintUpgradeableBasicNft --rpc-url $LOCAL_ANVIL_RPC_URL --broadcast -vvvv
```

### misc

forge script script/DeployRaceGridNFT.s.sol:DeployRaceGridNFT --rpc-url $LOCAL_ANVIL_RPC_URL --broadcast -vvvv
