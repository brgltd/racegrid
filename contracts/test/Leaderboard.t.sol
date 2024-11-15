// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {Leaderboard} from "../src/Leaderboard.sol";

contract LeaderboardTest is Test {
    uint256 public constant TIME = 30000;

    address public ALICE = makeAddr("alice");
    address public BOB = makeAddr("bob");

    Leaderboard public leaderboard;

    function setUp() public {
        leaderboard = new Leaderboard();
    }

    function testLeaderboard() public {
        Leaderboard.Result[] memory leaderboardResult;
        leaderboard.updateLeaderboard(ALICE, TIME);
        leaderboard.updateLeaderboard(BOB, TIME);
        leaderboardResult = leaderboard.getResultsPaginated(0, leaderboard.getResultsLength());
        assertEq(leaderboardResult[0].player, ALICE);
        assertEq(leaderboardResult[0].time, TIME);
        assertEq(leaderboardResult[1].player, BOB);
        assertEq(leaderboardResult[0].time, TIME);
        leaderboard.deleteLeaderboard();
        assertEq(leaderboard.getResultsLength(), 0);
    }
}
