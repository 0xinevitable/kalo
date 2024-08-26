// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ExponentialBondingCurveERC20 is ERC20, Ownable {
    uint256 public constant BASE_PRICE = 0.00001 ether;
    uint256 public constant EXPONENT_FACTOR = 0.0003606 ether;
    uint256 public constant PRICE_PRECISION = 1 ether;
    uint256 public constant TOKEN_STEP = 500 ether;

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
        uint256 fee = (ethToReturn * feePercentage) / 10000;
        uint256 ethAfterFee = ethToReturn - fee;

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
        uint256 marketCap = (supply * PRICE_PRECISION) / TOKEN_STEP;
        uint256 exponent = (marketCap * EXPONENT_FACTOR) / PRICE_PRECISION;
        return (BASE_PRICE * exp(exponent)) / PRICE_PRECISION;
    }

    function exp(uint256 x) internal pure returns (uint256) {
        // This is a simplified exponential function approximation
        // Accurate for small values of x
        return
            PRICE_PRECISION +
            x +
            ((x * x) / (2 * PRICE_PRECISION)) +
            ((x * x * x) / (6 * PRICE_PRECISION * PRICE_PRECISION));
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
