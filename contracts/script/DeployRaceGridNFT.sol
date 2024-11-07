// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {RaceGridNFT} from "../src/RaceGridNFT.sol";

contract DeployRaceGridNFT is Script {
    function run() external returns (RaceGridNFT) {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        RaceGridNFT raceGridNFT = new RaceGridNFT();
        console.log("RaceGridNFT deployed to", address(raceGridNFT));
        vm.stopBroadcast();
        return raceGridNFT;
    }
}
