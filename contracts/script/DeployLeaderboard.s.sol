// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Leaderboard} from "../src/Leaderboard.sol";

contract DeployLeaderboard is Script {
    function run() external returns (Leaderboard) {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        Leaderboard leaderboard = new Leaderboard();
        console.log("Leaderboard deployed to", address(leaderboard));
        vm.stopBroadcast();
        return leaderboard;
    }
}
