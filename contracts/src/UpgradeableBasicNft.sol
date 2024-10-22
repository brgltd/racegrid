// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpgradeableBasicNft is ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    // When making updrades, don't change the order or delete or modify any of the existing state variables.
    // If adding new variables, add after the existing ones.

    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;

    /// @notice Prevent contract from being used until `initialize` is called.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string calldata name, string calldata symbol) public initializer {
        __ERC721_init(name, symbol);
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function mintNft(string memory tokenUri) public {
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToUri[tokenId];
    }

    function poke() external pure returns (string memory) {
        return "v2";
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // This would only be necessary if this contract would be the base of a child contract.
    // It's the 32 bytes per state variable - 50.
    // For example if having to uint256's, then gap should be 48.
    // uint256[48] __gap;
}
