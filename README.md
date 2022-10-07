# Deploying a smart contract on the ropsten testnetwork

The frontend used to interact with the network was written in react. <br>
The frontend uses the ether library. <br>
The smart contract was written in solidity and implements fucntion such as sending a coin from address A to address B, checking balance of an address, etc. <br>
The hardhat is used for the eth dev. <br>

To deploy the contract, commands below can be used.
```shell
npx hardhat compile
npx harhat clean
npx hardhat run scripts/deploy.js --network ropsten
```
Token will be deployed at address 0x....

Copy the smart contract address to https://ropsten.etherscan.io/ to see if it was deployed

