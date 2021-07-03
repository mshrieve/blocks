// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import './Libraries/Math.sol';

contract MathHarness {
    using Math for uint256;

    function logarithm(uint256 operand) public pure returns (uint256) {
        return operand.logarithm();
    }

    function exponent_table_lookup(uint256 index)
        public
        pure
        returns (uint256)
    {
        return index.exponent_table_lookup();
    }

    function power_of_two_lookup(uint256 index) public pure returns (uint256) {
        return index.power_of_two_lookup();
    }

    function exponentiate(uint256 exponent) public pure returns (uint256) {
        return exponent.exponentiate();
    }

    function padeExponentiate(uint256 exponent) public pure returns (uint256) {
        return exponent.padeExponentiate();
    }

    function pade_coefficient_lookup(uint256 index)
        public
        pure
        returns (uint256)
    {
        return index.pade_coefficient_lookup();
    }

    function power(uint256 base, uint256 exponent)
        public
        pure
        returns (uint256)
    {
        return base.power(exponent);
    }
}
