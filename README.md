# Sample Voting App with Truffle, Solidity and Javascript

Project based on this tutorial:
https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-2-30b3d335aa1f

## Prerequisites

- install [Node.js](https://nodejs.org/es/)
- install project dependencies
```bash
$ npm install
```
- install ethereum local:
On Mac:
```bash
$ brew tap ethereum/ethereum
$ brew install ethereum
```
On Ubuntu:
```bash
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install ethereum
```
- start ethereum node:
```bash
$ geth --rinkeby --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024  --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"
```

## Usage

- create account (replace 'verystrongpassword' for a real password):
```bash
$ truffle console

truffle(default)> web3.personal.newAccount('verystrongpassword')
'0x95a94979d86d9c32d1d2ab5ace2dcc8d1b446fa1'

truffle(default)> web3.eth.getBalance('0x95a94979d86d9c32d1d2ab5ace2dcc8d1b446fa1')
{ [String: '0'] s: 1, e: 0, c: [ 0 ] }

truffle(default)> web3.personal.unlockAccount('0x95a94979d86d9c32d1d2ab5ace2dcc8d1b446fa1', 'verystrongpassword', 15000)
true
```
- compile contract:
```bash
$ truffle migrate
```
- start server:
```bash
$ npm run dev
```

----
## OUTDATED

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
or
```bash
$ npm install
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
