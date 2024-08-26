// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.20 <0.9.0;

interface IUniswapV2Callee {
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external;
}
