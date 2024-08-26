// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ExponentialBondingCurveERC20.sol';

contract ExponentialBondingCurveFactory {
    event BondingCurveCreated(
        address bondingCurveAddress,
        string name,
        string symbol
    );

    function createBondingCurve(
        string memory name,
        string memory symbol,
        uint256 feePercentage,
        address feeCollector
    ) external returns (address) {
        ExponentialBondingCurveERC20 newBondingCurve = new ExponentialBondingCurveERC20(
                name,
                symbol,
                feePercentage,
                feeCollector,
                msg.sender,
                address(this)
            );

        emit BondingCurveCreated(address(newBondingCurve), name, symbol);
        return address(newBondingCurve);
    }
}
