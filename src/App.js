import './App.css';
import React, { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json'

const address = "0x251E22783Ecd00cc5A03Bb3cc190fc0a99e43100"
// const tokenAddress = "0x68635287221d4Ff2F1031aA83A79be8359af871b"
const tokenAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016"

function App() {
  const [greeting, setGreet] = useState();
  const [unMinted, setUnMinted] = useState(-1);
  const [minted, setMinted] = useState();
  const [amount, setAmount] = useState();
  const [distributeAddress, setDistributeAddress] = useState();
  const [sendTokenAddres, setSendTokenAddress] = useState();
  const [increaseAmount, setIncreaseAmount] = useState();
  const [decreaseAmount, setDecreaseAmount] = useState();
  const [accountBalance, setAccountBalance] = useState();
  const [accountAddress, setAccountAddress] = useState();
  const [sendBetweenAddress,setSendBetweenAddress] = useState({
    addressA: "",
    addressB: "",
    amount: 0
  })
  
  async function reqAccount(){
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }

  
  async function fetchGreeting(){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(address, Greeter.abi, provider)
      try{
        const data = await contract.greet()
        console.log('data: ', data)
      } catch(err){
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting(){
   if (!greeting) return;
   if (typeof window.ethereum !== 'undefined'){
     await reqAccount()
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new ethers.Contract(address, Greeter.abi, signer)
     const transaction = await contract.setGreeting(greeting)
     await transaction.wait()
     fetchGreeting()
   }
   
  }

  async function getUnMintedSupply() {
    const contract = getEthereumContract();
    if (contract){
      try{
        const data = await contract.getUnMintedSupply();
        console.log('unminted balance', data.toNumber())
        setUnMinted( data.toNumber());
      } catch (err){
        console.log("Error: ", err);
      }
    }
  }
  
    
  async function getMintedSupply() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = getEthereumContract();
      try {
        const data = await contract.getMintedSupply();
        console.log("MINTED SUPPLY: " + data.toNumber());
        setMinted(data.toNumber());
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function distributeNonMintedTokens() {
    if (!distributeAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const contract = await getWriteContract();
      const transaction = await contract.distributeNonMintedTokens(distributeAddress);
      console.log("distributed tokens");
    }
  }
  
  async function increaseTotalSupply() {
    if (!increaseAmount) return;
    if (increaseAmount < 0) return;
    const contract = await getWriteContract();
    if (contract){
      console.log(increaseAmount)
      const transaction = await contract.increaseTotalSupply(increaseAmount);
      await transaction.wait();
      console.log("done")
      getMintedSupply();
    } 
  }

  async function decreaseTotalSupply() {
    if (!decreaseAmount) return;
    const contract = await getWriteContract();
    await contract.wait();
    if (contract) {
      const transaction = await contract.decreaseTotalSupply(decreaseAmount);
      await transaction.wait();
      getMintedSupply();
    }
    
  }

  async function sendTokens() {
    if (typeof window.ethereum !== 'undefined'){
      await reqAccount;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //sendAtoB(signer.getAddress);
    }
  }

  async function sendAtoB(){
    console.log(sendBetweenAddress.addressA)
    if(!sendBetweenAddress.addressA){
      return;
    }
    if(!sendBetweenAddress.addressB || sendBetweenAddress.amount === 0)
        return;

    const contract = await getWriteContract();
    if (contract){
      const transaction = await contract.sendAtoB(sendBetweenAddress.addressA,sendBetweenAddress.addressB,sendBetweenAddress.amount);
      await transaction.wait();
      console.log("send done");
    }
  }

  async function getAccountBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = getEthereumContract();

      try {
        const data = await contract.balanceOf(accountAddress);
        console.log("Account Balance: " + data.toNumber());
        setAccountBalance(data.toNumber());
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function getWriteContract(){
    if (typeof window.ethereum !== 'undefined'){
      await reqAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(tokenAddress, Token.abi, signer)
    }
    return null;
  }

  function getEthereumContract(){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return new ethers.Contract(tokenAddress, Token.abi, provider);
    }
    return null
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Distribute Unminted Tokens</p>
        <div>
          <input onChange={e=> setDistributeAddress(e.target.value)} placeholder="address"></input>
          <button onClick={distributeNonMintedTokens}>Distribute</button>
        </div>
        <div>
          <input onChange={e => setAccountAddress(e.target.value)} placeholder="Enter your address"></input>
          <button onClick={accountAddress ? getAccountBalance: null}>GET BALANCE</button>
          <p>Balance = {accountBalance ? accountBalance : 0}</p>
        </div>
        <div>
          <button onClick={getUnMintedSupply}>Get Unminted</button>
          <p>Unminted supply = {unMinted}</p>
        </div>
        <div>
          <button onClick={getMintedSupply}>Get Minted</button>
          <p>Minted supply = {minted}</p>
        </div>
        <div>
          <button onClick={() => {getMintedSupply(); getUnMintedSupply()}}>Get total supply</button>
          <p>Total supply = {minted + unMinted}</p>
        </div>
        <div>
          <input onChange={e=> setIncreaseAmount(e.target.value)} placeholder="increase amount"></input>
          <button onClick ={increaseTotalSupply}>Increase</button>
        </div>
        <div>
          <input onChange={e=> setDecreaseAmount(e.target.value)} placeholder="decrease amount"></input>
          <button onClick ={decreaseTotalSupply}>Decrease</button>
        </div>
        <div>
          <input onChange={e=> setSendBetweenAddress({addressA: e.target.value, addressB: sendBetweenAddress.addressB, amount: sendBetweenAddress.amount})} placeholder="Address A"></input>
          <input onChange={e=> setSendBetweenAddress({addressA: sendBetweenAddress.addressA, addressB: e.target.value, amount: sendBetweenAddress.amount})} placeholder="Address B"></input>
          <input onChange={e=> setSendBetweenAddress({addressA: sendBetweenAddress.addressA, addressB: sendBetweenAddress.addressB, amount: e.target.value})} placeholder="Amount"></input>
          <button onClick ={sendAtoB}>Send</button>
        </div>
        <button onClick={sendTokens}>Send me to B</button>
      </header>
    </div>
  );
}

export default App;

/*
  function getUnMintedSupply() external view returns (uint){
        return unmintedSupply;
    }

    function getMintedSupply() external view returns(uint){
        return totalSupply-unmintedSupply;
    }
    
    function distributeNonMintedTokens(address toReceive) external {
        require(unmintedSupply > 0, "No more unminted supply");
        uint amount = unmintedSupply / 10;
        balances[toReceive] = amount;
        unmintedSupply -= amount;
    }

    function increaseTotalSupply(uint amount) external{
        require(msg.sender == firstMinter, "Permission denied: Unauthorized access");
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
*/