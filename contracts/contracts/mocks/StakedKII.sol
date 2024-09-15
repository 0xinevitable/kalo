// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract StakedKII is ERC20 {
    uint256 private constant RATIO = 985; // 0.985 * 1000 to avoid floating point
    uint256 private constant RATIO_DENOMINATOR = 1000;

    constructor() ERC20('Staked KII', 'sKII') {}

    function stake() public payable {
        require(msg.value > 0, 'Must send ETH to stake');
        uint256 tokensToMint = (msg.value * RATIO) / RATIO_DENOMINATOR;
        _mint(msg.sender, tokensToMint);
    }

    function unstake(uint256 amount) public {
        require(amount > 0, 'Must unstake a positive amount');
        require(balanceOf(msg.sender) >= amount, 'Insufficient balance');

        uint256 ethToReturn = (amount * RATIO_DENOMINATOR) / RATIO;
        require(
            address(this).balance >= ethToReturn,
            'Insufficient ETH in contract'
        );

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(ethToReturn);
    }

    function estimateStakeOut(uint256 ethAmount) public pure returns (uint256) {
        return (ethAmount * RATIO) / RATIO_DENOMINATOR;
    }

    function estimateUnstakeOut(
        uint256 tokenAmount
    ) public pure returns (uint256) {
        return (tokenAmount * RATIO_DENOMINATOR) / RATIO;
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    receive() external payable {}
}
