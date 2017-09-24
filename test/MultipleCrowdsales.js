var QuantstampSale = artifacts.require("./QuantstampSale.sol");
var QuantstampICO = artifacts.require("./QuantstampICO.sol");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");

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

      console.log("allowance: " + allowance);
      console.log("ownerBalanceAfter: " + ownerBalanceAfter);
      console.log("allowanceAfter: " + allowanceAfter);

      assert.equal(allowance - (amountWei * rate), ownerBalanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, amountWei * rate, "The user should have gained amountWei*rate miniQSP");
      assert.equal(allowanceAfter + user2BalanceAfter, initialSupply, "The total tokens should remain the same");
  });

  it("should accept another 10 ether, reaching the goal", async function() {
      let tokenOwner = await token.owner();

      var amountEther = 10;
      var amountWei = web3.toWei(amountEther, "ether");

      let allowance = (await token.allowance(tokenOwner, sale.address)).toNumber();

      console.log("10ethertest, allowanceBefore: " + allowance);

      await sale.sendTransaction({from: user2,  value: web3.toWei(amountEther, "ether")});

      let allowanceAfter = (await token.allowance(tokenOwner, sale.address)).toNumber();

      let user2BalanceAfter = (await token.balanceOf(user2)).toNumber();
      let ownerBalanceAfter = (await token.balanceOf(tokenOwner)).toNumber();

      console.log("10ethertest, ownerBalanceAfter: " + ownerBalanceAfter);
      console.log("10ethertest, allowance: " + allowance);

      assert.equal(allowance - web3.toWei(10, "ether"), ownerBalanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, web3.toWei(12, "ether") * rate, "The user should have gained amountWei*rate miniQSP");
      assert.equal(allowanceAfter + user2BalanceAfter, initialSupply, "The total tokens should remain the same");
  });
/*
  it("should transfer tokens back to the owner of the token", async function() {
      let tokenOwner = await token.owner();

      let saleBalance = (await token.balanceOf(tokenOwner)).toNumber();

      let tokenOwnerBalance = await token.balanceOf(tokenOwner);
      tokenOwnerBalance = tokenOwnerBalance.toNumber();
      
      console.log(tokenOwner);
      console.log(saleBalance);
      console.log(tokenOwnerBalance);

      await sale.testTransferTokens(tokenOwner, saleBalance);

      console.log("asdf");

      let saleBalanceAfter = await token.balanceOf(sale.address);
      saleBalanceAfter = saleBalanceAfter.toNumber();

      let tokenOwnerBalanceAfter = await token.balanceOf(tokenOwner);
      tokenOwnerBalanceAfter = tokenOwnerBalanceAfter.toNumber();

      console.log(saleBalanceAfter  + "  " + tokenOwnerBalanceAfter);

      assert.equal(saleBalanceAfter, 0, "The crowdsale no longer has tokens associated with it");
      assert.equal(tokenOwnerBalanceAfter, tokenOwnerBalance + saleBalance, "All crowdsale tokens now belong to the token owner");
  });

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
