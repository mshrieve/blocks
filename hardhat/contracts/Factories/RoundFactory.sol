// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '../Round.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './TokenFactory.sol';

contract RoundFactory is Ownable {
    TokenFactory private _token_factory;
    mapping(address => bool) private _whitelist;

    modifier onlyWhiteList() {
        require(_whitelist[msg.sender], 'only whitelisted controllers');
        _;
    }

    constructor() Ownable() {
        _token_factory = new TokenFactory();
    }

    function whitelistController(address controller) external {
        _whitelist[controller] = true;
    }

    function deployRound(
        uint256 N,
        uint256 b,
        uint256 delta,
        address asset,
        address vault_address,
        uint256 expiry_timestamp,
        address aggregator
    ) external onlyWhiteList returns (address) {
        Round round = new Round(
            N,
            b,
            delta,
            asset,
            vault_address,
            expiry_timestamp,
            aggregator
        );
        address token_address = _token_factory.deployToken(
            N,
            b,
            address(round)
        );
        round.attachToken(token_address);

        return address(round);
    }
}
