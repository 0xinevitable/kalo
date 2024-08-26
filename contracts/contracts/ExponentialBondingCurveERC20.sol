// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ExponentialBondingCurveERC20 is ERC20, Ownable {
    uint256 public constant BASE_PRICE = 0.00001 ether;
    uint256 public constant EXPONENT_FACTOR = 0.0003606 ether;
    uint256 public constant PRICE_PRECISION = 1 ether;
    uint256 public constant TOKEN_STEP = 100 ether;

    uint256 public feePercentage;
    address public feeCollector;
    address public factory;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _feePercentage,
        address _feeCollector,
        address initialOwner,
        address _factory
    ) ERC20(name, symbol) Ownable(initialOwner) {
        feePercentage = _feePercentage;
        feeCollector = _feeCollector;
        factory = _factory;
    }

    function buy() external payable {
        uint256 fee = (msg.value * feePercentage) / 10000;
        uint256 ethForTokens = msg.value - fee;
        uint256 tokensToBuy = calculatePurchaseReturn(ethForTokens);
        require(tokensToBuy > 0, 'Insufficient ETH sent');
        payable(feeCollector).transfer(fee);
        _mint(msg.sender, tokensToBuy);
    }

    function sell(uint256 tokenAmount) external {
        require(tokenAmount > 0, 'Must sell a positive amount');
        require(balanceOf(msg.sender) >= tokenAmount, 'Insufficient balance');

        uint256 ethToReturn = calculateSaleReturn(tokenAmount);
        require(ethToReturn > 0, 'Sale would result in zero ETH');

        uint256 fee = (ethToReturn * feePercentage) / 10000;
        uint256 ethAfterFee = ethToReturn - fee;

        uint256 contractBalance = address(this).balance;
        if (contractBalance < ethToReturn) {
            // Partial sell if there's insufficient liquidity
            ethToReturn = contractBalance;
            fee = (ethToReturn * feePercentage) / 10000;
            ethAfterFee = ethToReturn - fee;
            tokenAmount = calculatePurchaseReturn(ethAfterFee);
        }

        payable(msg.sender).transfer(ethAfterFee);
        payable(feeCollector).transfer(fee);
        _burn(msg.sender, tokenAmount);
    }

    function calculatePurchaseReturn(
        uint256 ethSent
    ) public view returns (uint256) {
        uint256 supply = totalSupply();
        uint256 newSupply = supply + TOKEN_STEP;
        uint256 avgPrice = (currentPrice(supply) + currentPrice(newSupply)) / 2;
        return (ethSent * PRICE_PRECISION) / avgPrice;
    }

    function calculateSaleReturn(
        uint256 tokenAmount
    ) public view returns (uint256) {
        uint256 supply = totalSupply();
        require(supply > tokenAmount, 'Cannot sell the entire supply');
        uint256 newSupply = supply - tokenAmount;
        uint256 avgPrice = (currentPrice(supply) + currentPrice(newSupply)) / 2;
        return (tokenAmount * avgPrice) / PRICE_PRECISION;
    }

    function currentPrice(uint256 supply) public pure returns (uint256) {
        if (supply == 0) return BASE_PRICE;
        uint256 x = (supply * EXPONENT_FACTOR) / TOKEN_STEP;
        return (BASE_PRICE * exp(x)) / PRICE_PRECISION;
    }

    function exp(uint256 x) internal pure returns (uint256) {
        unchecked {
            if (x == 0) return PRICE_PRECISION;

            uint256 result = PRICE_PRECISION;
            uint256 xi = x;
            uint256 term = PRICE_PRECISION;

            for (uint256 i = 1; i <= 8; i++) {
                term = (term * xi) / (i * PRICE_PRECISION);
                result += term;

                if (term < PRICE_PRECISION / 100) {
                    break;
                }
            }

            return result;
        }
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(
            from == address(this) ||
                to == address(this) ||
                from == factory ||
                to == factory ||
                from == address(0) ||
                to == address(0),
            'Transfers are only allowed to or from bonding curve related contracts'
        );
        super._update(from, to, amount);
    }

    function updateFeePercentage(uint256 _feePercentage) external onlyOwner {
        feePercentage = _feePercentage;
    }

    function updateFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }
}
