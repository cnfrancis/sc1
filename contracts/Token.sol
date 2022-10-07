//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Token {
    address private firstMinter;
    string public tokenName;
    string public symbol;
    uint public totalSupply;
    uint public unmintedSupply;
    mapping(address => uint) balances;

    constructor() {
        firstMinter = msg.sender;
        tokenName = "Surface Mounted";
        symbol = "SMD";
        totalSupply = 10000000;
        balances[msg.sender] += totalSupply * 9 / 10;
        unmintedSupply = totalSupply / 10;

    }
    
    function getUnMintedSupply() external view returns (uint){
        return unmintedSupply;
    }

    function getMintedSupply() external view returns(uint){
        return totalSupply-unmintedSupply;
    }
    
    function distributeNonMintedTokens(address toReceive) external {
        require(unmintedSupply > 0, "The unminted supply is depleted");
        require(msg.sender == firstMinter, "Not authorized");
        uint amount = unmintedSupply / 10;
        balances[toReceive] = amount;
        unmintedSupply -= amount;
    }

    function increaseTotalSupply(uint amount) external{
        require(msg.sender == firstMinter, "Permission denied: Unauthorized access");
        unmintedSupply += amount;
        totalSupply += amount;
    }

    function decreaseTotalSupply(uint amount) external{
        require(msg.sender == firstMinter, "Permission denied: Unauthorized access");
        require(totalSupply-amount >= unmintedSupply, "Permission denied: UnmintedSupply greater than decrease amount");
        totalSupply -= amount;
    }

    function sendTokens(address toSend, uint amount) external {
        sendAtoB(msg.sender, toSend, amount);
    }

    function sendAtoB(address addressA, address addressB, uint amount) public{
        require (balances[addressA] >= amount, "Insuffienct funds to send");
        balances[addressA] -= amount;
        balances[addressB] += amount;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
}

/*
functions:
send to address, amount
get leftOverSupply [x]
get currentSupply [x]
send from address A, to address B, amount (only founder can perform)
increase totalSupply by amount (only founder can perform)
decrease totalSupply by amount (only founder can perform)
distributeNonMintedTokens() random % amount
*/