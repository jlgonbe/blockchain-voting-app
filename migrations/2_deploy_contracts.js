var Voting = artifacts.require('./Voting.sol');

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
    { gas: 290000 }
  );
};
