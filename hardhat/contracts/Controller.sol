// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import './Factories/RoundFactory.sol';

import './Vault.sol';
import './Interfaces/IRoundFactory.sol';

contract Controller is Ownable {
    address[] private _rounds; // public, list, get a child address at row #
    mapping(address => bool) public _isRound; // valid rounds
    event RoundCreated(address round, address asset, uint256 expiry);
    address private _vault_address;
    RoundFactory private _round_factory;
    Vault private _vault;

    constructor(address round_factory_address) Ownable() {
        _vault = new Vault();
        _round_factory = RoundFactory(round_factory_address);
    }

    function getRounds() external view returns (address[] memory) {
        return _rounds;
    }

    function getVaultAddress() external view returns (address) {
        return address(_vault);
    }

    function deployRound(
        uint256 N,
        uint256 b,
        uint256 delta,
        address asset,
        uint256 expiry,
        address aggregator
    ) external onlyOwner {
        address round = _round_factory.deployRound(
            N,
            b,
            delta,
            asset,
            address(_vault),
            expiry,
            aggregator
        );
        _vault.approveRound(round);
        _rounds.push(round);
        _isRound[round] = true;
        emit RoundCreated(round, asset, expiry); // emit an event - another way to monitor this
    }
}
