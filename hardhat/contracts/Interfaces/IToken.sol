// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';

interface IToken is IERC1155 {
    event roundEnded(uint256 earnings, uint256 payout, uint256 timestamp);

    function getQuantity(uint256 bucket) external view returns (uint256);

    function burn(
        address account,
        uint256 bucket,
        uint256 amount
    ) external;

    function purchase(
        uint256 bucket,
        uint256 amount,
        address recipient
    ) external returns (uint256);

    function purchaseRange(
        uint256 start,
        uint256 end,
        uint256 amount,
        address recipient
    ) external returns (uint256);

    function purchaseSlope(
        uint256 bucket,
        uint256 amount,
        bool left,
        address recipient
    ) external returns (uint256);

    function getBucketPrice(uint256 bucket) external view returns (uint256);
}
