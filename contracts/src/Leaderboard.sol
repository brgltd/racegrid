// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Leaderboard is Ownable {
    struct Result {
        address player;
        uint256 time;
        uint256 date;
    }

    Result[] private results;

    constructor() Ownable(msg.sender) {}

    /// @notice Add new entry to the leaderboard.
    // For hackathon or testnets it's okay to leave this open. For mainnet needs to be `onlyOwner`.
    function updateLeaderboard(address player, uint256 time) external {
        results.push(Result({player: player, time: time, date: block.timestamp}));
    }

    /// @notice Retrieve leaderboard results.
    /// @dev Using pagination to avoid OOG. Client is responsible for aggregation and sorting.
    function getResultsPaginated(uint256 startIndex, uint256 endIndex) external view returns (Result[] memory) {
        Result[] memory resultsCopy = results;
        Result[] memory paginatedResults = new Result[](endIndex - startIndex);
        uint256 paginatedResultsIndex;
        for (uint256 i = startIndex; i < endIndex; ++i) {
            paginatedResults[paginatedResultsIndex] = resultsCopy[i];
            ++paginatedResultsIndex;
        }
        return paginatedResults;
    }

    /// @notice Delete one entry from the leaderboard.
    /// @dev Mainly used for testing.
    function deleteLeaderboardEntry(uint256 targetIndex) external onlyOwner {
        Result[] memory resultsCopy = results;
        uint256 lastIndex = results.length - 1;
        if (targetIndex != lastIndex) {
            Result memory lastItem = resultsCopy[targetIndex];
            results[lastIndex] = resultsCopy[targetIndex];
            results[targetIndex] = lastItem;
        }
        results.pop();
    }

    /// @notice Delete the entire leaderboard.
    /// @dev Mainly used for testing.
    function deleteLeaderboard() external onlyOwner {
        Result[] memory emptyResults;
        results = emptyResults;
    }

    /// @notice Retrive leaderboard length.
    /// @dev Can to be used when calling with pagination.
    function getResultsLength() external view returns (uint256) {
        return results.length;
    }
}
