// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IRoundFactory {
    function deployRound(
        uint256 N,
        uint256 b,
        uint256 delta,
        address asset,
        address vault,
        uint256 expiry_timestamp,
        address aggregator
    ) external returns (address);
}
