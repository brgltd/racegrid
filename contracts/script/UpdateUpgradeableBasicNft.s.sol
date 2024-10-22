// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Options} from "openzeppelin-foundry-upgrades/Options.sol";
import {console} from "forge-std/console.sol";

contract UpdateUpgradeableBasicNft is Script {
    function run() external {
        Options memory options;
        options.unsafeSkipAllChecks = true;

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        Upgrades.upgradeProxy(
            vm.envAddress("UPGRADEABLE_BASIC_NFT_PROXY_ADDRESS"), "UpgradeableBasicNft.sol", "", options
        );

        console.log("implementation contract updated");

        vm.stopBroadcast();
    }
}
