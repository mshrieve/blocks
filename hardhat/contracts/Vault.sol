// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Vault {
    mapping(address => uint256) balances;

    constructor() {}

    function handleTransferToVault(
        address round,
        uint256 amount,
        address asset
    ) public {
        IERC20(asset).transferFrom(round, address(this), amount);
        balances[asset] += amount;
    }

    // if a round incurs losses, we need to pay out from the reserves
    function handleTransferFromVault(
        address round,
        uint256 amount,
        address asset
    ) public {
        IERC20(asset).transfer(round, amount);
        balances[asset] -= amount;
    }
}
