// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IVault {
    event redemption(address recipient, uint256 amount, address asset_address);

    function approveRound(address round) external;

    function revokeRound(address round) external;

    function redeem(
        address recipient,
        uint256 amount,
        address asset_address
    ) external;
}
