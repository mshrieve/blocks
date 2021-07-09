// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './Controller.sol';
import './Token.sol';

contract Vault is Ownable {
    mapping(address => bool) public _rounds; // valid rounds
    uint256 public _debt;
    Controller _controller;

    modifier onlyRound {
        require(_rounds[msg.sender], 'can only call Vault from a Round');
        _;
    }
    event redemption(address recipient, uint256 amount, address asset_address);

    constructor() Ownable() {
        _controller = Controller(msg.sender);
    }

    function redeem(
        address recipient,
        uint256 amount,
        address asset_address
    ) external {
        require(_controller._isRound(msg.sender));
        IERC20(asset_address).transfer(recipient, amount);
        emit redemption(recipient, amount, asset_address);
    }
}
