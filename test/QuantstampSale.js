
var QuantstampSale = artifacts.require("./QuantstampSale.sol");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");



contract('QuantstampSale (Basic Tests)', function(accounts) {
  // account[0] points to the owner on the testRPC setup
  var owner = accounts[0];
  var user1 = accounts[1];
  var user2 = accounts[2];
  var user3 = accounts[3];

  it("should send 2 ether to the crowdfunding campaign", async function(done) {
      var amountEther = 2;
      var amountRaisedAfterTransaction = web3.toWei(2, "ether"); 
      let sale = await QuantstampSale.deployed();
      let token = await QuantstampToken.deployed();

      let saleBalance = await token.balanceOf(sale.address);
      console.log(saleBalance);
      await sale.sendTransaction({from: user3, value: web3.toWei(amountEther, "ether")})
      console.log("Hit?");
      //assert.equal(decimals, 18);
  });


});

/*
contract('QuantstampSale', function(accounts) {
  // account[0] points to the owner on the testRPC setup
  var owner = accounts[0];
  var user1 = accounts[1];
  var user2 = accounts[2];
  var user3 = accounts[3];


  it("should send 2 ether to the crowdfunding campaign", function(done) {
      var amountEther = 2;
      var amountRaisedAfterTransaction = web3.toWei(2, "ether"); 

      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          // return quantstamp.send(web3.toWei(amountEther, "ether"));
          return sale.sendTransaction({from: user3, value: web3.toWei(amountEther, "ether")})
      }).then(function(result) {
          return sale.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });

  it("should send an additional 3 ether to the crowdfunding campaign", function(done) {
      var amountEther = 3;
      var amountRaisedAfterTransaction = web3.toWei(5, "ether"); 

      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return instance.sendTransaction({from: user2, value: web3.toWei(amountEther, "ether")});
      }).then(function(){
          return sale.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });

  it("should pause and not accept payment", function(done) {
      var amountEther = 6;
      var amountRaisedAfterTransaction = web3.toWei(5, "ether"); 

      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return instance.pause();
      }).then(function(){
          return sale.sendTransaction({from: user2, value: web3.toWei(amountEther, "ether")});
      }).then(assert.fail).catch(function(error) {
          console.log(error.message);
          return sale.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised changed even when paused");
      }).then(done).catch(done);
  });

  it("should not allow a user to unpause the contract", function(done) {
      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return instance.unpause({from: user1});
      }).then(assert.fail).catch(function(error) {
          console.log(error.message);
          return sale.paused.call();
      }).then(function(value){
          console.log("paused: " + value)
          assert.equal(value, true, "The contract should not be paused by a user");
      }).then(done).catch(done);
  });

  it("should unpause and now accept payment", function(done) {
      var amountEther = 6;
      var amountRaisedAfterTransaction = web3.toWei(11, "ether"); 

      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return sale.unpause();
      }).then(function(){
          return sale.sendTransaction({from: user2, value: web3.toWei(amountEther, "ether")});
      }).then(function(){
          return sale.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });

  it("should not allow a user to pause the contract", function(done) {
      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return instance.pause({from: user1});
      }).then(assert.fail).catch(function(error) {
          console.log(error.message);
          return sale.paused.call();
      }).then(function(value){
          console.log("paused: " + value)
          assert.equal(value, false, "The contract should not be paused by a user");
      }).then(done).catch(done);
  });

  it("should send an additional 10 ether to the crowdfunding campaign, exceeding the cap", function(done) {
      var amountEther = 10;
      var amountRaisedAfterTransaction = web3.toWei(20, "ether"); 

      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return instance.sendTransaction({from: user2, value: web3.toWei(amountEther, "ether")});
      }).then(function(){
          return sale.amountRaised.call();
      }).then(function(value){
          console.log("amountRaised: " + value)
          assert.equal(value, amountRaisedAfterTransaction, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });

  it("should not accept payment after reaching the cap", function(done) {
      var amountEther = 3;
      var amountRaisedAfterTransaction = web3.toWei(20, "ether"); 

      QuantstampSale.deployed().then(function(instance) {
          sale = instance;
          return sale.sendTransaction({from: user3, value: web3.toWei(amountEther, "ether")});
      }).then(assert.fail).catch(function(error) {
          console.log(error.message);
          return sale.fundingCapIsReached.call();
      }).then(function(value){
          console.log("fundingCapIsReached: " + value);
          assert.equal(value, true, "AmountRaised changed even when paused");
      }).then(done).catch(done);
  });

});
*/