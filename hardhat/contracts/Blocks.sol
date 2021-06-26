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

    uint256 constant decimals = 18;
    uint256 constant e_decimals = 10**decimals;

    constructor(uint256 N, uint256 b) ERC1155('none') {
        require(N > 0, 'constructor: N should be positive');
        _N = N;
        require(b > 0, 'constructor: b should be positive');
        _b = b;

        _total_weight = _N * e_decimals;
        _value = _b * _total_weight.logarithm();
    }

    function purchase(uint256 bucket, uint256 amount) public {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
        // need to add 1, since weights are initialized at zero
        uint256 old_weight = _weights[bucket] + e_decimals;
        uint256 new_weight = (old_weight * multiplier) / e_decimals;
        uint256 total_weight = _total_weight - old_weight + new_weight;
        uint256 value = _b * total_weight.logarithm();
        uint256 price = value - _value;
        _total_weight = total_weight;
        // subtract 1, to make the base weight zero
        _weights[bucket] = new_weight - e_decimals;
        _quantities[bucket] += amount;
        // _earnings += price;

        _mint(msg.sender, bucket, amount, '');
    }

    function fake_purchase(uint256 bucket, uint256 amount) public {
        _mint(msg.sender, bucket, amount, '');
    }

    // function purchaseBatch(uint256[] buckets, uint256[] amounts) public {
    //     // uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
    //     // // need to add 1, since weights are initialized at zero
    //     // uint256 old_weight = _weights[bucket] + e_decimals;
    //     // uint256 new_weight = (old_weight * multiplier) / e_decimals;
    //     // uint256 total_weight = _total_weight - old_weight + new_weight;
    //     // uint256 value = _b * total_weight.logarithm();
    //     // uint256 price = value - _value;
    //     // _total_weight = total_weight;
    //     // // subtract 1, to make the base weight zero
    //     // _weights[bucket] = new_weight - e_decimals;
    //     // _quantities[bucket] += amount;
    //     // _earnings += price;

    //     // _mint(msg.sender, bucket, amount, "");
    // }

    function get_bucket_price(uint256 bucket) public view returns (uint256) {
        return ((_weights[bucket] + e_decimals) * e_decimals) / _total_weight;
    }

    // amount required to move the price to the specificied price
    function getRequiredAmount(uint256 bucket, uint256 price)
        public
        view
        returns (uint256)
    {
        require(price < e_decimals, 'getRequiredAmount: price too high');
        require(
            price > get_bucket_price(bucket),
            'getRequiredAmount: price too low'
        );
        return
            _b *
            (((_total_weight - _weights[bucket] - e_decimals) *
                price *
                e_decimals) /
                ((_weights[bucket] + e_decimals) * (e_decimals - price)))
            .logarithm();
    }
}
