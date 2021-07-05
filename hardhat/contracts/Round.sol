// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './Libraries/Math.sol';
import './Interfaces/IVault.sol';
import './Token.sol';
import './Mocks/Aggregator.sol';

contract Round is Ownable {
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

    // static Round parameters

    uint256 public _N;
    uint256 public _b;
    uint256 public _delta;

    // Round stats

    uint256 public _earnings;

    // time
    uint256 public _start_timestamp;
    uint256 public _expiry_timestamp;

    // post-round variables

    bool public _round_ended;
    uint256 public _final_price;
    uint256 public _final_bucket;
    uint256 public _payout;
    uint256 public _debt;

    mapping(address => uint256) public _paid_out;

    // decimals

    uint256 constant decimals = 18;
    uint256 constant _e_decimals = 10**decimals;
    uint256 public _asset_decimals;

    // interfaces
    ERC20 public _asset;

    Token private _token;
    address private _token_address;
    Aggregator private _aggregator;
    address private _vault_address;

    modifier onlyBeforeExpiry {
        require(
            block.timestamp < _expiry_timestamp,
            'this function is not callable after expiry'
        );
        _;
    }

    modifier onlyAfterExpiry {
        require(
            block.timestamp >= _expiry_timestamp,
            'this function is not callable before expiry'
        );
        _;
    }

    modifier onlyAfterRoundHasEnded {
        require(
            _round_ended,
            'this function is not callable before the endRound has been called.'
        );
        _;
    }

    event roundEnded(uint256 earnings, uint256 payout, uint256 timestamp);

    constructor(
        uint256 N,
        uint256 b,
        uint256 delta,
        address asset,
        address vault_address,
        uint256 expiry_timestamp,
        address aggregator
    ) Ownable() {
        require(N > 0, 'constructor: N should be positive');
        _N = N;
        require(b > 0, 'constructor: b should be positive');
        _delta = delta;

        _expiry_timestamp = expiry_timestamp;
        _start_timestamp = block.timestamp;

        _asset = ERC20(asset);
        _asset_decimals = 10**_asset.decimals();
        _vault_address = vault_address;
        _aggregator = Aggregator(aggregator);
    }

    function attachToken(address token_address) external onlyOwner {
        require(_token_address == address(0), 'token already attached');
        _token_address = token_address;
    }

    function getAssetAddress() public view returns (address) {
        return address(_asset);
    }

    function purchase(uint256 bucket, uint256 amount)
        external
        onlyBeforeExpiry
    {
        // mint the tokens
        uint256 price = _token.purchase(bucket, amount, msg.sender);
        _earnings += price;
        // transfer asset from user to Vault
        _asset.transferFrom(
            msg.sender,
            _vault_address,
            (price * _asset_decimals) / _e_decimals
        );
    }

    function purchaseRange(
        uint256 start,
        uint256 end,
        uint256 amount
    ) external onlyBeforeExpiry {
        // mint the tokens
        uint256 price = _token.purchaseRange(start, end, amount, msg.sender);
        _earnings += price;
        // transfer asset from user to Vault
        _asset.transferFrom(
            msg.sender,
            _vault_address,
            (price * _asset_decimals) / _e_decimals
        );
    }

    function purchaseSlope(
        uint256 bucket,
        uint256 amount,
        bool left
    ) external onlyBeforeExpiry {
        // mint the tokens
        uint256 price = _token.purchaseSlope(bucket, amount, left, msg.sender);
        _earnings += price;
        // transfer approved assets to Vault
        _asset.transferFrom(
            msg.sender,
            _vault_address,
            (price * _asset_decimals) / _e_decimals
        );
    }

    function endRound() external onlyAfterExpiry {
        require(!_round_ended, 'round has already been ended');
        int256 final_price = _aggregator.latestAnswer();
        // start tracking balance
        require(final_price > 0, 'invalid final price');

        _final_price = (uint256(final_price) * _e_decimals) / _asset_decimals;
        _round_ended = true;
        _final_bucket = _final_price / (_delta * _e_decimals);
        _payout = _token.getQuantity(_final_bucket);

        emit roundEnded(_earnings, _payout, block.timestamp);
    }

    function redeem() external onlyAfterRoundHasEnded {
        uint256 user_balance = _token.balanceOf(msg.sender, _final_bucket);
        _token.burn(msg.sender, _final_bucket, user_balance);
        IVault(_vault_address).redeem(
            msg.sender,
            (user_balance * _asset_decimals) / _e_decimals,
            address(_asset)
        );
    }

    function getBucketPrice(uint256 bucket) public view returns (uint256) {
        return _token.getBucketPrice(bucket);
    }
}
