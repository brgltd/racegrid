#!/bin/bash

source .env

rpc_url=""

if [[ $1 == "anvil" ]]; then
  rpc_url=$LOCAL_ANVIL_RPC_URL
elif [[ $1 == "taiko-testnet" ]]; then
  rpc_url=$TAIKO_TESTNET_RPC_URL
else
  echo "invalid argument"
  exit 1
fi

echo deploying to $1 with $rpc_url

forge script script/DeployRaceGridNFT.s.sol:DeployRaceGridNFT --rpc-url $rpc_url --broadcast -vvvv

forge script script/DeployLeaderboard.s.sol:DeployLeaderboard --rpc-url $rpc_url --broadcast -vvvv
