// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VendorVault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public vendorBalances;
    mapping(address => bool) public isRegisteredVendor;
    
    uint256 public constant ORGANIZER_FEE_BPS = 1000; // 10%
    
    event PaymentProcessed(address indexed vendor, uint256 amount, uint256 fee);
    event VendorWithdrawn(address indexed vendor, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function registerVendor(address _vendor) external onlyOwner {
        isRegisteredVendor[_vendor] = true;
    }

    function payVendor(address _vendor) external payable nonReentrant {
        require(isRegisteredVendor[_vendor], "Vendor not registered");
        require(msg.value > 0, "No value sent");

        uint256 fee = (msg.value * ORGANIZER_FEE_BPS) / 10000;
        uint256 vendorShare = msg.value - fee;

        vendorBalances[_vendor] += vendorShare;
        vendorBalances[owner()] += fee;

        emit PaymentProcessed(_vendor, msg.value, fee);
    }

    function withdraw() external nonReentrant {
        uint256 amount = vendorBalances[msg.sender];
        require(amount > 0, "No funds");

        vendorBalances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit VendorWithdrawn(msg.sender, amount);
    }
}