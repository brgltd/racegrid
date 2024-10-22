// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {BasicNft} from "../src/BasicNft.sol";

contract MintBasicNft is Script {
    string public constant PUG_URI =
        "https://ipfs.io/ipfs/bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/7487";

    function run() public {
        BasicNft basicNft = BasicNft(vm.envAddress("BASIC_NFT_ADDRESS"));
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        basicNft.mintNft(PUG_URI);
        vm.stopBroadcast();
    }
}
