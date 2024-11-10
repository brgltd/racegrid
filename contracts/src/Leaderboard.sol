// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Leaderboard {
    struct Result {
        address player;
        uint256 time;
        uint256 date;
    }

    Result[] private results;

    // TODO: for hackathon or testnets it's okay to leave this open. For mainnet needs to be `onlyOwner`.
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

    function getResultsLength() external view returns (uint256) {
        return results.length;
    }
}
