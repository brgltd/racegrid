// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {Leaderboard} from "../src/Leaderboard.sol";

contract LeaderboardTest is Test {
    uint256 public constant TIME = 30000;

    address public PLAYER = makeAddr("player1");

    Leaderboard public leaderboard;

    function setUp() public {
        leaderboard = new Leaderboard();
    }

    function testGetResultsPaginated() public {
        Leaderboard.Result[] memory leaderboardResult;
        leaderboard.updateLeaderboard(PLAYER, TIME);
        leaderboardResult = leaderboard.getResultsPaginated(0, 1);
        assertEq(leaderboardResult[0].player, PLAYER);
        assertEq(leaderboardResult[0].time, TIME);
    }
}
