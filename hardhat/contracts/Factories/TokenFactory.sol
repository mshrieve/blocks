// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import '../Token.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TokenFactory is Ownable {
    constructor() Ownable() {}

    function deployToken(
        uint256 N,
        uint256 b,
        address round_address
    ) external onlyOwner returns (address) {
        Token token = new Token(N, b, round_address);
        return address(token);
    }
}
