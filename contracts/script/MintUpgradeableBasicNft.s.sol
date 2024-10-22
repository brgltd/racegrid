// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {UpgradeableBasicNft} from "../src/UpgradeableBasicNft.sol";

contract MintUpgradeableBasicNft is Script {
    string public constant PUG_URI =
        "https://ipfs.io/ipfs/bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/7487";

    function run() public {
        UpgradeableBasicNft upgradeableBasicNft =
            UpgradeableBasicNft(vm.envAddress("UPGRADEABLE_BASIC_NFT_PROXY_ADDRESS"));
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        upgradeableBasicNft.mintNft(PUG_URI);
        vm.stopBroadcast();
    }
}
