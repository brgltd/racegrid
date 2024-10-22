#!/bin/bash

rm ../frontend/abis -rf

mkdir ../frontend/abis

mv out/UpgradeableBasicNft.sol/UpgradeableBasicNft.json ../frontend/abis/UpgradeableBasicNft.json

echo "Done"
