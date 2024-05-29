// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Wallet {
    mapping(address => uint) private Wallets;

    function retirer(address payable _to, uint _amount) external {
        require(_amount <= Wallets[msg.sender], "Insufficient balance");
        Wallets[msg.sender] -= _amount;
        _to.transfer(_amount);
    }

    function recevoir() external payable {
        Wallets[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint) {
        return Wallets[msg.sender];
    }

    receive() external payable {
        Wallets[msg.sender] += msg.value;
    }

    fallback() external payable {}
}
