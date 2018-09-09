var Jury = artifacts.require("./Jury.sol");



module.exports = function(deployer) {
  deployer.then(function() {
    return Jury.new();
  }).then(function(instance) {

    console.log('Jury: ok ' + instance.address);

  })
};
