// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import './UniswapV2Pair.sol';

contract UniswapV2CalHash {
    function getInitHash() public pure returns (bytes32) {
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}
