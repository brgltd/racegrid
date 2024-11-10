source .env

forge script script/DeployRaceGridNFT.s.sol:DeployRaceGridNFT --rpc-url $LOCAL_ANVIL_RPC_URL --broadcast -vvvv

forge script script/DeployLeaderboard.s.sol:DeployLeaderboard --rpc-url $LOCAL_ANVIL_RPC_URL --broadcast -vvvv
