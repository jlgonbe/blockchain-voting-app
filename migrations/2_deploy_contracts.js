var Voting = artifacts.require('./Voting.sol');
var Taker = artifacts.require('./TakerTest.sol');

module.exports = function(deployer) {
  let employees = [
    'Hector Garzon', 
    'Alvaro Huertas', 
    'Jose Luis Gonzalez', 
    'Jose Antonio Noe', 
    'Daniel Pardo', 
    'Alejandro Moros'
  ];
  
  deployer.deploy(Voting, 
    employees, 
    { gas: 700000 }
  );
  deployer.deploy(Taker, 
    10000,
    'TakerTest',
    'TTT', 
    { gas: 5000000 }
  );
};
