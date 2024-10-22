// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Options} from "openzeppelin-foundry-upgrades/Options.sol";
import {console} from "forge-std/console.sol";
import {UpgradeableBasicNft} from "../src/UpgradeableBasicNft.sol";

contract DeployUpgradeableBasicNft is Script {
    function run() external returns (address) {
        Options memory options;
        options.unsafeSkipAllChecks = true;

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        address proxy = Upgrades.deployUUPSProxy(
            "UpgradeableBasicNft.sol",
            abi.encodeCall(UpgradeableBasicNft.initialize, ("MyUpgradeableNFT", "UNFT")),
            options
        );
        console.log("proxy deployed to", address(proxy));

        vm.stopBroadcast();

        return proxy;
    }
}
