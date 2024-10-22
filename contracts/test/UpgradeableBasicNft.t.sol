// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Options} from "openzeppelin-foundry-upgrades/Options.sol";
import {UpgradeableBasicNft} from "../src/UpgradeableBasicNft.sol";

contract BasicNftTest is Test {
    string public constant TOKEN_URI =
        "https://ipfs.io/ipfs/bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/7487";

    string public constant NAME = "MyNFT";

    string public constant SYMBOL = "MNFT";

    address public USER = makeAddr("USER");

    UpgradeableBasicNft basicNft;

    function setUp() public {
        Options memory options;
        options.unsafeSkipAllChecks = true;
        address proxy = Upgrades.deployUUPSProxy(
            "UpgradeableBasicNft.sol", abi.encodeCall(UpgradeableBasicNft.initialize, (NAME, SYMBOL)), options
        );
        basicNft = UpgradeableBasicNft(proxy);
    }

    function testNameIsCorrect() public view {
        assertEq(keccak256(abi.encodePacked(NAME)), keccak256(abi.encodePacked(basicNft.name())));
    }

    function testCanMintAndHaveBalance() public {
        vm.prank(USER);
        basicNft.mintNft(TOKEN_URI);
        assert(basicNft.balanceOf(USER) == 1);
        assert(keccak256(abi.encodePacked(TOKEN_URI)) == keccak256(abi.encodePacked(basicNft.tokenURI(0))));
    }
}
