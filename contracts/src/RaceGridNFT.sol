// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RaceGridNFT is ERC721 {
    uint256 private constant FEE = 0.01e18;

    uint256 private tokenId;

    mapping(uint256 id => string uri) public tokenIdToURI;

    /// @notice Last token owned by an address.
    mapping(address user => string uri) public userToTokenURI;

    constructor() ERC721("RaceGrid", "RCG") {}

    function mint(string memory uri) public payable {
        require(msg.value >= FEE, "insufficient fee");
        tokenIdToURI[tokenId] = uri;
        userToTokenURI[msg.sender] = uri;
        _safeMint(msg.sender, tokenId);
        ++tokenId;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return tokenIdToURI[id];
    }
}
