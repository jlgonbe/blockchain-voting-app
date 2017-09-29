# Sample Voting App with Solidity and Javascript

Project based on this tutorial: https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2

## Prerequisites

- install [Node.js](https://nodejs.org/es/)
- install ethereumjs-testrpc (run local sample ethereum blockchain)
- install web3, version 0.20.1 until version 1.0.0 is released (manage blockchain with javascript)
- install solc (compile Solidity contracts)
- install http-server (run sample local server)
```bash
$ npm install ethereumjs-testrpc
$ npm install web3@0.20.1
$ npm install solc
$ npm install http-server
```

## Usage

- start testrpc blockchain local server
```bash
$ node_modules/.bin/testrpc 
```
- compile Voting contract
```bash
$ node js/compile-voting.js
```
```
// sample output
Deploying the contract
Your contract is being deployed in transaction :: 0xd989daba630dbb86b49c9e69f6b064e06ad478dadbb2f7123173e06a04b03ed5
Your contract has been deployed at address :: 0x4e434ad70357afdbf4f18c4ca77e1dba44c8e787
Note that it might take 30 - 90 sceonds for the block to propagate before it's visible
```
- modify js/main.js
```javascript
let contractInstance = VotingContract.at([contract_address]); 

// in sample output 0x4e434ad70357afdbf4f18c4ca77e1dba44c8e787
let contractInstance = VotingContract.at('0x4e434ad70357afdbf4f18c4ca77e1dba44c8e787');
```
- start server
```bash
$ http-server
```
