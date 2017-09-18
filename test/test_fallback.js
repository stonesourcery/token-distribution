
var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {

  it("should send 2 ether to the crowdfunding campaign", function(done) {
      var amountEther = 2;
      var amountRaisedAfterTransaction = web3.toWei(2, "ether"); 

      Quantstamp.deployed().then(function(instance) {
          quantstamp = instance;
          // return quantstamp.send(web3.toWei(amountEther, "ether"));
          return instance.sendTransaction({from: accounts[3], value: web3.toWei(amountEther, "ether")})
      }).then(function(result) {
          return quantstamp.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });

  it("should send an additional 3 ether to the crowdfunding campaign", function(done) {
      var amountEther = 3;
      var amountRaisedAfterTransaction = web3.toWei(5, "ether"); 

      Quantstamp.deployed().then(function(instance) {
          quantstamp = instance;
          return instance.sendTransaction({from: accounts[2], value: web3.toWei(amountEther, "ether")});
      }).then(function(){
          return quantstamp.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });

  it("should pause and not accept payment", function(done) {
      var amountEther = 6;
      var amountRaisedAfterTransaction = web3.toWei(5, "ether"); 

      Quantstamp.deployed().then(function(instance) {
          quantstamp = instance;
          return instance.pause();
      }).then(function(){
          return quantstamp.sendTransaction({from: accounts[2], value: web3.toWei(amountEther, "ether")});
      }).then(assert.fail).catch(function(error) {
          console.log(error.message);
          return quantstamp.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised changed even when paused");
      }).then(done).catch(done);
  });


});
