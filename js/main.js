'use strict';

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

    if (typeof json != 'string') {
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

// Create a web3 connection to a running geth node over JSON-RPC running at :: http://localhost:8545
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]');
let VotingContract = web3.eth.contract(abi);

// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed 
// and change the line below to use your deployed address
let contractInstance = VotingContract.at('0x497af6790af59aee7fee8574943963081096106a');
let candidates = { 'Rama': 'candidate-1', 'Nick': 'candidate-2', 'Jose': 'candidate-3' };

function voteForCandidate() {
  let candidateName = $('#candidate').val();
  contractInstance.voteForCandidate(candidateName, { from: web3.eth.accounts[0] }, function () {
    let div_id = candidates[candidateName];
    $('#' + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  });
}

function showBlocks() {
  $('#blocks').html('');

  let blocksToShow = $('#blocksToShow').val();
  for (var i = 0; i < blocksToShow; i++) {
    let block = web3.eth.getBlock(web3.eth.blockNumber - i);
    console.log(block);

    jsonDisplay.outputDivID = 'blocks';
    jsonDisplay.outputPretty(JSON.stringify(block));
  }
}

$(document).ready(function () {
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let val = contractInstance.totalVotesFor.call(name).toString()
    $('#' + candidates[name]).html(val);
  }
});
