// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
    constructor() ERC20('WETH', 'WETH') {}

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
}
