// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import './Libraries/Math.sol';

// This is the main building block for smart contracts.
contract Blocks is ERC1155 {
    using Math for uint256;

    mapping(uint256 => uint256) public _weights;
    mapping(uint256 => uint256) public _quantities;
    uint256 public _N;
    uint256 public _total_weight;
    uint256 public _total_sold;
    uint256 public _b;
    uint256 public _value;
    uint256 public _earnings;

    uint256 constant e_decimals = 1e18;

    constructor(uint256 N, uint256 b) ERC1155('none') {
        require(N > 0, 'constructor: N should be positive');
        _N = N;
        require(b > 0, 'constructor: b should be positive');
        _b = b;

        _total_weight = _N * e_decimals;
        _value = _b * _total_weight.logarithm();
    }
}
