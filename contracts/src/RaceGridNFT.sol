// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RaceGridNFT is ERC721 {
    uint256 public counter;
    mapping(uint256 id => string uri) tokens;

    constructor() ERC721("RaceGrid", "RCG") {}

    function mint(string memory uri) public {
        tokens[counter] = uri;
        _safeMint(msg.sender, counter);
        ++counter;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return tokens[id];
    }
}
