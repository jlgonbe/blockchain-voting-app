'use strict';

const fs = require('fs');
const Web3 = require('web3'); // https://www.npmjs.com/package/web3
const solc = require('solc');

// Create a web3 connection to a running geth node over JSON-RPC running at :: http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// Read the compiled contract code
let source = fs.readFileSync('contract/Voting.sol').toString();

// ABI description as JSON structure
let compiledSource = solc.compile(source, 1);
let abi = JSON.parse(compiledSource.contracts[':Voting'].interface);

// Create Contract proxy class
let VotingContract = web3.eth.contract(abi);

console.log('Deploying the contract');
let byteCode = compiledSource.contracts[':Voting'].bytecode;
let deployedContract = VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });

// Transaction has entered to geth memory pool
console.log('Your contract is being deployed in transaction :: ' + deployedContract.transactionHash);

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
function waitBlock() {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log('Your contract has been deployed at address :: ' + receipt.contractAddress);
      console.log('Note that it might take 30 - 90 sceonds for the block to propagate before it\'s visible');
      break;
    }
    console.log('Waiting a mined block to include your contract... currently in block ' + web3.eth.blockNumber);
    sleep(4000);
  }
}

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

waitBlock();
