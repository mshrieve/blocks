// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './Libraries/Math.sol';

contract Blocks is ERC1155 {
    ///////////////////////////////////////////////////////////////////////////
    //       ___                       ___           ___           ___       //
    //      /\  \          ___        /\  \         /\  \         /\  \      //
    //     /::\  \        /\  \      /::\  \       /::\  \       /::\  \     //
    //    /:/\:\  \       \:\  \    /:/\:\  \     /:/\:\  \     /:/\:\  \    //
    //   /:/  \:\  \      /::\__\  /::\~\:\  \   /:/  \:\  \   /::\~\:\  \   //
    //  /:/__/ \:\__\  __/:/\/__/ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\ \:\__\  //
    //  \:\  \  \/__/ /\/:/  /    \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  /  //
    //   \:\  \       \::/__/        |:|::/  /   \:\  \            \::/  /   //
    //    \:\  \       \:\__\        |:|\/__/     \:\  \           /:/  /    //
    //     \:\__\       \/__/        |:|  |        \:\__\         /:/  /     //
    //      \/__/                     \|__|         \/__/         \/__/      //
    ///////////////////////////////////////////////////////////////////////////

    using Math for uint256;

    mapping(uint256 => uint256) public _weights;
    mapping(uint256 => uint256) public _quantities;
    uint256 public _N;
    uint256 public _total_weight;
    uint256 public _total_sold;
    uint256 public _b;
    uint256 public _value;
    uint256 public _earnings;
    uint256 public _delta;

    uint256 constant decimals = 18;
    uint256 constant e_decimals = 10**decimals;
    uint256 constant e_decimals_to_usdc = 10**12;

    IERC20 private _WETH;
    IERC20 private _USDC;

    constructor(
        uint256 N,
        uint256 b,
        uint256 d,
        address USDC
    ) ERC1155('none') {
        require(N > 0, 'constructor: N should be positive');
        _N = N;
        require(b > 0, 'constructor: b should be positive');
        _b = b;

        _total_weight = _N * e_decimals;
        _value = (_b * _total_weight.logarithm()) / e_decimals;
        _delta = d;

        _USDC = IERC20(USDC);
    }

    function purchase(uint256 bucket, uint256 amount) public {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
        // need to add 1, since weights are initialized at zero
        uint256 old_weight = _weights[bucket] + e_decimals;
        uint256 new_weight = (old_weight * multiplier) / e_decimals;
        uint256 total_weight = _total_weight - old_weight + new_weight;
        uint256 value = (_b * total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;
        _total_weight = total_weight;
        // subtract 1, to make the base weight zero
        _weights[bucket] = new_weight - e_decimals;
        _quantities[bucket] += amount;
        _earnings += price;
        _value = value;

        _USDC.transferFrom(
            msg.sender,
            address(this),
            price / e_decimals_to_usdc
        );
        _mint(msg.sender, bucket, amount, '');
    }

    function purchaseRange(
        uint256 start,
        uint256 end,
        uint256 amount
    ) public {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
        // need to add 1, since weights are initialized at zero
        uint256 length = end - start;
        require(start < end);
        require(end <= _N);
        uint256[] memory buckets = new uint256[](length);
        uint256[] memory amounts = new uint256[](length);
        uint256 accumulated_weight;

        for (uint256 i = 0; i < length; i++) {
            // add one
            uint256 old_weight = _weights[start + i] + e_decimals;
            uint256 new_weight = (old_weight * multiplier) / e_decimals;

            accumulated_weight += new_weight - old_weight;
            // subtract 1, to make the base weight zero
            _weights[start + i] = new_weight - e_decimals;
            _quantities[start + i] += amount;

            buckets[i] = start + i;
            amounts[i] = amount;
        }

        _total_weight += accumulated_weight;
        uint256 value = (_b * _total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;

        _value = value;
        _earnings += price;

        _USDC.transferFrom(
            msg.sender,
            address(this),
            price / e_decimals_to_usdc
        );
        _mintBatch(msg.sender, buckets, amounts, '');
    }

    function purchaseLeftSlope(uint256 bucket, uint256 amount) public {
        uint256 base_multiplier = ((amount * e_decimals) / (bucket * _b))
        .exponentiate();
        uint256 multiplier = base_multiplier;
        // need to add 1, since weights are initialized at zero
        uint256[] memory buckets = new uint256[](bucket);
        uint256[] memory amounts = new uint256[](bucket);
        uint256 accumulated_weight;
        uint256 amount_increment = amount / bucket;
        uint256 bucket_amount = amount_increment;
        uint256 i = bucket;
        for (uint256 j = 0; j < bucket; j++) {
            // add one
            i -= 1;
            uint256 old_weight = _weights[i] + e_decimals;
            uint256 new_weight = (old_weight * multiplier) / e_decimals;
            accumulated_weight += new_weight - old_weight;
            // subtract 1, to make the base weight zero
            _weights[i] = new_weight - e_decimals;
            _quantities[i] += bucket_amount;
            buckets[i] = i;
            amounts[i] = bucket_amount;
            multiplier = (multiplier * base_multiplier) / e_decimals;
            bucket_amount += amount_increment;
        }

        _total_weight += accumulated_weight;
        uint256 value = (_b * _total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;

        _value = value;
        _earnings += price;

        _USDC.transferFrom(
            msg.sender,
            address(this),
            price / e_decimals_to_usdc
        );
        _mintBatch(msg.sender, buckets, amounts, '');
    }

    function fakePurchase(uint256 bucket, uint256 amount) public {
        _mint(msg.sender, bucket, amount, '');
    }

    function purchaseBatch(uint256[] memory buckets, uint256[] memory amounts)
        public
    {
        require(buckets.length == amounts.length);
        uint256 total_weight = _total_weight;
        for (uint256 i = 0; i < buckets.length; i++) {
            uint256 multiplier = ((amounts[i] * e_decimals) / _b)
            .padeExponentiate();
            // need to add 1, since weights are initialized at zero
            uint256 old_weight = _weights[buckets[i]] + e_decimals;
            uint256 new_weight = (old_weight * multiplier) / e_decimals;
            total_weight = total_weight - old_weight + new_weight;

            // subtract 1, to make the base weight zero
            _weights[buckets[i]] = new_weight - e_decimals;
            _quantities[buckets[i]] += amounts[i];
        }
        uint256 value = _b * total_weight.logarithm();
        uint256 price = value - _value;
        _total_weight = total_weight;
        _earnings += price;
        _value = value;
        _mintBatch(msg.sender, buckets, amounts, '');
    }

    function getBucketPrice(uint256 bucket) public view returns (uint256) {
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
            price > getBucketPrice(bucket),
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
