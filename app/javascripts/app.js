'use strict';

// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import { jsonDisplay } from './syntax-highlighting';
import { addAlert } from './html-generator';

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */
import voting_artifacts from '../../build/contracts/Voting.json';

var Voting = contract(voting_artifacts);

let candidates = {
  'Hector Garzon': 'candidate-1', 
  'Alvaro Huertas': 'candidate-2', 
  'Jose Luis Gonzalez': 'candidate-3', 
  'Jose Antonio Noe': 'candidate-4', 
  'Daniel Pardo': 'candidate-5', 
  'Alejandro Moros': 'candidate-6'
};

window.showBlocks = () => {
  $('#blocks').html('');

  let blocksToShow = $('#blocksToShow').val();
  for (var i = 0; i < blocksToShow; i++) {
    let block = web3.eth.getBlock(web3.eth.blockNumber - i);
    if (block !== null) {
      console.log(block);

      jsonDisplay.outputDivID = 'blocks';
      jsonDisplay.outputPretty(JSON.stringify(block));
    }
  }
};

window.voteForCandidate = (candidate) => {
  let candidateName = $('#candidate').val();
  $('#candidate').val('');

  /* Voting.deployed() returns an instance of the contract. Every call
   * in Truffle returns a promise which is why we have used then()
   * everywhere we have a transaction call
   */
  Voting.deployed().then((contractInstance) => {
    $('#messages').append(addAlert('info', 'Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.'));

    contractInstance.voteForCandidate(candidateName, { gas: 140000, from: web3.eth.accounts[0] }).then(() => {
      let div_id = candidates[candidateName];
      return contractInstance.totalVotesFor.call(candidateName).then((v) => {
        $('#' + div_id).html(v.toString());
        $('#messages').html('');
      });
    }).catch((err) => {
      $('#messages').html('');
      $('#messages').append(addAlert('danger', 'Error voting for candidate: ' + err.message));
    });
  });
};

window.unlockAccount = () => {
  let account = web3.eth.accounts[0];
  let password = $('#password').val();
  $('#password').val('');
  $('#messages').html('');
  
  try {
    web3.personal.unlockAccount(account, password);
    $('#messages').append(addAlert('success', 'Account ' + account + ' unlocked!'));
  } catch (err) {
    $('#messages').append(addAlert('danger', 'Error unlocking account: ' + account + ', error: ' + err.message + ''));
  }
};

window.createAccount = () => {
  let password = $('#password').val();
  $('#password').val('');
  $('#messages').html('');

  try {
    let account = web3.personal.newAccount(password);
    $('#messages').append(addAlert('success', 'Account ' + account + ' created!'));
    $('#unlockAccount').show();
    $('#createAccount').hide();
  } catch (err) {
    $('#messages').append(addAlert('danger', 'Error creating account:' + err.message + ''));
  }
};

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source like Metamask');
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  if (web3.eth.accounts[0]) {
    $('#unlockAccount').show();
    $('#createAccount').hide();
  } else {
    $('#createAccount').show();
    $('#unlockAccount').hide();
  }

  Voting.setProvider(web3.currentProvider);
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    Voting.deployed().then(function (contractInstance) {
      contractInstance.totalVotesFor.call(name).then(function(v) {
        $('#' + candidates[name]).html(v.toString());
      });
    });
  }
});
