// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import './Blocks.sol';
import './Vault.sol';

contract Controller {
    address[] public _rounds; // public, list, get a child address at row #
    event RoundCreated(address round); // maybe listen for events
    Vault public _vault;

    constructor() {
        _vault = new Vault();
    }

    function getRounds() public view returns (address[] memory) {
        return _rounds;
    }

    function getVaultAddress() public view returns (address) {
        return address(_vault);
    }

    function createRound(
        uint256 N,
        uint256 b,
        uint256 delta,
        address asset,
        address vault
    ) public {
        Blocks round = new Blocks(N, b, delta, asset, vault);
        emit RoundCreated(address(round)); // emit an event - another way to monitor this
        _rounds.push(address(round)); // you can use the getter to fetch child addresses
    }
}
