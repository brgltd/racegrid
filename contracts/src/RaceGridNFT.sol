// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title RaceGridNFT
/// @notice NFTs for the Race Grid blockchain racing game.
contract RaceGridNFT is ERC721 {
    /// @notice The token id counter.
    uint256 private tokenId;

    /// @notice Map an token id to token URI.
    mapping(uint256 id => string uri) public tokenIdToURI;

    /// @notice Map an address to token URI.
    /// @dev Last token owned by an address.
    mapping(address user => string uri) public userToTokenURI;

    /// @notice Initialize the NFT.
    constructor() ERC721("RaceGrid", "RCG") {}

    /// @param uri The NFT URI.
    function mint(string memory uri) public {
        tokenIdToURI[tokenId] = uri;
        userToTokenURI[msg.sender] = uri;
        _safeMint(msg.sender, tokenId);
        ++tokenId;
    }

    /// @notice Returns the token URI for a token id.
    /// @param id The token id.
    /// @return The token URI.
    function tokenURI(uint256 id) public view override returns (string memory) {
        return tokenIdToURI[id];
    }
}
