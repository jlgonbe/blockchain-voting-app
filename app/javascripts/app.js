'use strict';

// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

/**
* Hat tip to PumBaa80 http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript 
* for the syntax highlighting function.
**/
let jsonDisplay = {

  jsonstring: '',
  outputDivID: 'shpretty',

  outputPretty: function (jsonstring) {
    jsonstring = jsonstring === '' ? jsonDisplay.jsonstring : jsonstring;
    // prettify spacing
    var pretty = JSON.stringify(JSON.parse(jsonstring), null, 2);
    // syntaxhighlight the pretty print version
    let shpretty = jsonDisplay.syntaxHighlight(pretty);
    // output to a div
    let newDiv = document.createElement('pre');
    newDiv.innerHTML = shpretty;
    document.getElementById(jsonDisplay.outputDivID).appendChild(newDiv);
  },

  syntaxHighlight: function (json) {

    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }

    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
};

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

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
import token from '../../build/contracts/Takertest.json';

var Voting = contract(voting_artifacts);
var Token = contract(token);

let candidates = {
  'Hector Garzon': 'candidate-1', 
  'Alvaro Huertas': 'candidate-2', 
  'Jose Luis Gonzalez': 'candidate-3', 
  'Jose Antonio Noe': 'candidate-4', 
  'Daniel Pardo': 'candidate-5', 
  'Alejandro Moros': 'candidate-6'
};

window.showBlocks = function () {
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

window.voteForCandidate = function(candidate) {
  let candidateName = $('#candidate').val();
  try {
    $('#msg').html('Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.');
    $('#candidate').val('');
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
     
    Voting.deployed().then(function(contractInstance) {
      contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        let div_id = candidates[candidateName];
        return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
          $('#' + div_id).html(v.toString());
          $('#msg').html('Vote done, transfering some Tokens..');

          //Send Token to specific address 
          Token.deployed().then(function(token) {
            var receiver = '0x1bcEc5795907D16082AcB2F401fF752A720be390';
            var amount = web3.toWei(0.001, "ether");
            token.transfer(receiver, amount).then(function(a){
                token.balanceOf(receiver).then(function(value){
                  $('#' + div_id).html(v.toString());
                  var newBalance=web3.fromWei(value,"ether");
                  $('#msg').html('Tokens given. New balance: ' + newBalance);
                  console.log("new balance: " + newBalance);
                });
            });  
          })
        });
      });
    });
  } catch (err) {
    $('#' + div_id).html(v.toString());
    $('#msg').html('Something was wrong...');
    console.log(err);
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

  Token.setProvider(web3.currentProvider);
  Token.defaults({from: web3.eth.accounts[0]});
  
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
