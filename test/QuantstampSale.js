
var QuantstampSale = artifacts.require("./QuantstampSale.sol");
var QuantstampICO = artifacts.require("./QuantstampICO.sol");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");

contract('Crowdsale Allowance of Tokens', function(accounts) {
  // account[0] points to the owner on the testRPC setup
  var owner = accounts[0];
  var user1 = accounts[1];
  var user2 = accounts[2];
  var user3 = accounts[3];

  beforeEach(function() {
    return QuantstampSale.deployed().then(function(instance) {
        sale = instance;
        return QuantstampToken.deployed();
    }).then(function(instance2){
      token = instance2;
      return token.INITIAL_SUPPLY();
    });
  });

  it("should be an allowance so that the crowdsale can transfer the tokens", async function() {
      let ownerBalance = (await token.balanceOf(owner)).toNumber();
      await token.setCrowdsale(sale.address);
      let allowance = (await token.allowance(owner, sale.address)).toNumber();
      assert.equal(allowance, ownerBalance);
  });

  it("should be able to send tokens to user from crowdsale allowance", async function() {
      let allowance = (await token.allowance(owner, sale.address)).toNumber();
      await sale.testTransferTokens(user1, allowance);

      // user has received all the tokens
      let user1Balance = (await token.balanceOf(user1)).toNumber();
      assert.equal(user1Balance, allowance, "The user should have received all the tokens");

      // crowdsale allowance is now 0
      allowance = (await token.allowance(owner, sale.address)).toNumber();
      assert.equal(allowance, 0, "The crowdsale should have an allowance of 0");
  });

});

contract('Multiple Crowdsales', function(accounts) {
  // account[0] points to the owner on the testRPC setup
  var owner = accounts[0];
  var user1 = accounts[1];
  var user2 = accounts[2];
  var user3 = accounts[3];

  beforeEach(function() {
    return QuantstampSale.deployed().then(function(instance) {
        sale = instance;
        return QuantstampToken.deployed();
    }).then(function(instance2){
      token = instance2;
      return token.INITIAL_SUPPLY();
    }).then(function(val){
      initialSupply = val.toNumber();
      return sale.rate();
    }).then(function(val){
      rate = val.toNumber();
      return QuantstampICO.deployed();
    }).then(function(instance3){
      ico = instance3;
      return ico.rate();
    }).then(function(val){
      ico_rate = val.toNumber();
    });
  });



  it("should accept 2 ether for the crowdfunding campaign", async function() {
      await token.setCrowdsale(sale.address); // ensures crowdsale has allowance of tokens
      let tokenOwner = await token.owner();

      var amountEther = 2;
      var amountWei = web3.toWei(amountEther, "ether");

      let allowance = (await token.allowance(tokenOwner, sale.address)).toNumber();

      await sale.sendTransaction({from: user2,  value: web3.toWei(amountEther, "ether")});

      let allowanceAfter = (await token.allowance(tokenOwner, sale.address)).toNumber();

      let user2BalanceAfter = (await token.balanceOf(user2)).toNumber();
      let ownerBalanceAfter = (await token.balanceOf(tokenOwner)).toNumber();

      assert.equal(allowance - (amountWei * rate), ownerBalanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, amountWei * rate, "The user should have gained amountWei*rate miniQSP");
      assert.equal(allowanceAfter + user2BalanceAfter, initialSupply, "The total tokens should remain the same");
  });
/*
  it("should transfer tokens back to the owner of the token", async function() {
      let tokenOwner = await token.owner();

      let saleBalance = (await token.balanceOf(tokenOwner)).toNumber();

      let tokenOwnerBalance = await token.balanceOf(tokenOwner);
      tokenOwnerBalance = tokenOwnerBalance.toNumber();

      await sale.testTransferTokens(tokenOwner)

      let saleBalanceAfter = await token.balanceOf(sale.address);
      saleBalanceAfter = saleBalanceAfter.toNumber();

      let tokenOwnerBalanceAfter = await token.balanceOf(tokenOwner);
      tokenOwnerBalanceAfter = tokenOwnerBalanceAfter.toNumber();

      assert.equal(saleBalanceAfter, 0, "The crowdsale no longer has tokens associated with it");
      assert.equal(tokenOwnerBalanceAfter, tokenOwnerBalance + saleBalance, "All crowdsale tokens now belong to the token owner");
  });
/*
  it("the owner of QuantstampToken should now send funds to the ICO", async function() {
      let ownerBalance = await token.balanceOf(owner);
      ownerBalance = ownerBalance.toNumber();

      await token.transferTokens(ico.address);
      let ownerBalanceAfter = await token.balanceOf(owner);
      let tokenBalance = await token.balanceOf(token.address);
      let icoBalance  = await token.balanceOf(ico.address);

      ownerBalanceAfter = ownerBalanceAfter.toNumber();
      tokenBalance = tokenBalance.toNumber();
      icoBalance  = icoBalance.toNumber();

      assert.equal(ownerBalanceAfter, 0, "The owner should not have any tokens after transferring");
      assert.equal(tokenBalance, 0, "The Token should not have any tokens allocated to its address");
      assert.equal(icoBalance, ownerBalance, "The crowdsale should have all the tokens from owner");
  });

  it("should accept 2 ether for the ICO", async function() {
      var amountEther = 2;
      var amountWei = web3.toWei(amountEther, "ether");

      let icoBalance = await token.balanceOf(ico.address);
      icoBalance = icoBalance.toNumber();

      let user2Balance = await token.balanceOf(user2);
      user2Balance = user2Balance.toNumber();

      await ico.sendTransaction({from: user2,  value: web3.toWei(amountEther, "ether")});

      let icoBalanceAfter = await token.balanceOf(ico.address);
      icoBalanceAfter = icoBalanceAfter.toNumber();

      let user2BalanceAfter = await token.balanceOf(user2);
      user2BalanceAfter = user2BalanceAfter.toNumber();

      assert.equal(icoBalance - (amountWei * ico_rate), icoBalanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, user2Balance + amountWei * ico_rate, "The user should have gained amountWei*rate miniQSP");
  });
*/

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