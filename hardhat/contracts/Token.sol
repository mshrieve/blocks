// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './Libraries/Math.sol';
import './Vault.sol';
import './Round.sol';
import './Mocks/Aggregator.sol';

contract Token is ERC1155 {
    using Math for uint256;

    // static Round parameters

    uint256 public _N;
    uint256 public _b;

    // Round stats

    mapping(uint256 => uint256) public _weights;
    mapping(uint256 => uint256) public _quantities;

    uint256 public _total_weight;
    uint256 public _value;

    // decimals

    uint256 constant decimals = 18;
    uint256 constant e_decimals = 10**decimals;
    uint256 constant e_decimals_to_usdc = 10**12;

    // interfaces
    address public _round_address;

    event roundEnded(uint256 earnings, uint256 payout, uint256 timestamp);

    constructor(
        uint256 N,
        uint256 b,
        address round_address
    ) ERC1155('none') {
        require(N > 0, 'constructor: N should be positive');
        require(b > 0, 'constructor: b should be positive');
        _N = N;
        _b = b;
        _total_weight = _N * e_decimals;
        _value = (_b * _total_weight.logarithm()) / e_decimals;
        _round_address = round_address;
    }

    modifier onlyRound {
        require(
            msg.sender == _round_address,
            'function only callable via Round'
        );
        _;
    }

    function getQuantity(uint256 bucket) public view returns (uint256) {
        return _quantities[bucket];
    }

    function burn(
        address account,
        uint256 bucket,
        uint256 amount
    ) external onlyRound {
        _burn(account, bucket, amount);
    }

    function incrementBucket(uint256 bucket, uint256 multiplier)
        internal
        returns (uint256 weight)
    {
        // need to add 1, since weights are initialized at zero
        uint256 old_weight = _weights[bucket] + e_decimals;
        uint256 new_weight = (old_weight * multiplier) / e_decimals;
        weight = new_weight - old_weight;
        // subtract 1, to make the base weight zero
        _weights[bucket] = new_weight - e_decimals;
    }

    function getIncrementBucketWeight(uint256 bucket, uint256 multiplier)
        internal
        view
        returns (uint256)
    {
        // need to add 1, since weights are initialized at zero
        uint256 old_weight = _weights[bucket] + e_decimals;
        uint256 new_weight = (old_weight * multiplier) / e_decimals;
        uint256 weight = new_weight - old_weight;
        return weight;
    }

    function purchase(
        uint256 bucket,
        uint256 amount,
        address recipient
    ) external onlyRound returns (uint256) {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();

        uint256 weight = incrementBucket(bucket, multiplier);
        _total_weight += weight;
        uint256 value = (_b * _total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;

        _quantities[bucket] += amount;
        _value = value;

        _mint(recipient, bucket, amount, '');
        return price;
    }

    function getPurchasePrice(uint256 bucket, uint256 amount)
        external
        view
        returns (uint256)
    {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
        uint256 total_weight = _total_weight +
            getIncrementBucketWeight(bucket, multiplier);
        uint256 value = (_b * total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;

        return price;
    }

    function purchaseRange(
        uint256 start,
        uint256 end,
        uint256 amount,
        address recipient
    ) external onlyRound returns (uint256) {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
        // need to add 1, since weights are initialized at zero
        uint256 length = end - start;
        require(start < end);
        require(end <= _N);
        uint256[] memory buckets = new uint256[](length);
        uint256[] memory amounts = new uint256[](length);

        for (uint256 bucket = start; bucket < end; bucket++) {
            _total_weight += incrementBucket(bucket, multiplier);

            _quantities[bucket] += amount;
            buckets[bucket - start] = bucket;
            amounts[bucket - start] = amount;
        }

        uint256 value = (_b * _total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;
        _value = value;

        _mintBatch(recipient, buckets, amounts, '');
        return price;
    }

    function getPurchaseRangePrice(
        uint256 start,
        uint256 end,
        uint256 amount
    ) external view returns (uint256) {
        uint256 multiplier = ((amount * e_decimals) / _b).exponentiate();
        require(start < end);
        require(end <= _N);
        uint256 total_weight = _total_weight;

        for (uint256 bucket = start; bucket < end; bucket++) {
            total_weight += getIncrementBucketWeight(bucket, multiplier);
        }

        uint256 value = (_b * _total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;
        return price;
    }

    function purchaseSlope(
        uint256 bucket,
        uint256 amount,
        bool left,
        address recipient
    ) external onlyRound returns (uint256) {
        require(bucket < _N, 'invalid bucket');

        (uint256 k, uint256 length) = left ? (0, bucket) : (2, _N - bucket);
        uint256[] memory buckets = new uint256[](length);
        uint256[] memory amounts = new uint256[](length);

        uint256 amount_increment = amount / length;
        uint256 bucket_amount = amount_increment;
        uint256 base_multiplier = ((amount * e_decimals) / (length * _b))
        .exponentiate();
        uint256 multiplier = base_multiplier;
        uint256 i = bucket;
        for (uint256 j = 0; j < length; j++) {
            i = i + k - 1;
            _total_weight += incrementBucket(i, multiplier);

            _quantities[i] += bucket_amount;
            buckets[j] = i;
            amounts[j] = bucket_amount;
            multiplier = (multiplier * base_multiplier) / e_decimals;
            bucket_amount += amount_increment;
        }

        uint256 value = (_b * _total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;
        _value = value;

        _mintBatch(recipient, buckets, amounts, '');
        return price;
    }

    function getPurchaseSlopePrice(
        uint256 bucket,
        uint256 amount,
        bool left
    ) external view returns (uint256) {
        require(bucket < _N, 'invalid bucket');

        (uint256 k, uint256 length) = left ? (0, bucket) : (2, _N - bucket);
        uint256 base_multiplier = ((amount * e_decimals) / (length * _b))
        .exponentiate();
        uint256 multiplier = base_multiplier;
        uint256 i = bucket;
        uint256 total_weight = _total_weight;

        for (uint256 j = 0; j < length; j++) {
            i = i + k - 1;
            total_weight += getIncrementBucketWeight(i, multiplier);
            multiplier = (multiplier * base_multiplier) / e_decimals;
        }

        uint256 value = (_b * total_weight.logarithm()) / e_decimals;
        uint256 price = value - _value;
        return price;
    }

    function getBucketPrice(uint256 bucket) external view returns (uint256) {
        return ((_weights[bucket] + e_decimals) * e_decimals) / _total_weight;
    }
}
