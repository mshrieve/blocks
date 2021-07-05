// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './Controller.sol';
import './Token.sol';

contract Vault is Ownable {
    mapping(address => bool) public _rounds; // valid rounds
    modifier onlyRound {
        require(_rounds[msg.sender], 'can only call Vault from a Round');
        _;
    }
    event redemption(address recipient, uint256 amount, address asset_address);

    constructor() Ownable() {}

    function approveRound(address round) external onlyOwner {
        _rounds[round] = true;
    }

    function revokeRound(address round) external onlyOwner {
        _rounds[round] = false;
    }

    function redeem(
        address recipient,
        uint256 amount,
        address asset_address
    ) external onlyRound {
        IERC20(asset_address).transfer(recipient, amount);
        emit redemption(recipient, amount, asset_address);
    }
}
