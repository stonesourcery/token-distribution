var QuantstampSale = artifacts.require("./QuantstampSale.sol");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");

var bigInt = require("big-integer");


async function logUserBalances (token, accounts) {
 console.log("")
 console.log("User Balances:")
 console.log("--------------")
 console.log(`Owner: ${(await token.balanceOf(accounts[0])).toNumber()}`)
 console.log(`User1: ${(await token.balanceOf(accounts[1])).toNumber()}`)
 console.log(`User2: ${(await token.balanceOf(accounts[2])).toNumber()}`)
 console.log(`User3: ${(await token.balanceOf(accounts[3])).toNumber()}`)

 console.log("--------------")
 console.log("")
}

async function logEthBalances (token, sale, accounts) {
 console.log("")
 console.log("Eth Balances:")
 console.log("-------------")
 console.log(`Owner: ${(await web3.eth.getBalance(accounts[0])).toNumber()}`)
 console.log(`User1: ${(await web3.eth.getBalance(accounts[1])).toNumber()}`)
 console.log(`User2: ${(await web3.eth.getBalance(accounts[2])).toNumber()}`)
 console.log(`User3: ${(await web3.eth.getBalance(accounts[3])).toNumber()}`)
 console.log(`Sale : ${(await web3.eth.getBalance(sale.address)).toNumber()}`)
 console.log(`Token: ${(await web3.eth.getBalance(token.address)).toNumber()}`)


 console.log("--------------")
 console.log("")
}

contract('Multiple Crowdsales', function(accounts) {
  // account[0] points to the owner on the testRPC setup
  var owner = accounts[0];
  var user1 = accounts[1];
  var user2 = accounts[2];
  var user3 = accounts[3];

  var sale2;

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
      return token.owner();
    }).then(function(owner){
      tokenOwner = owner;
      return token.CROWDSALE_ALLOWANCE();
    }).then(function(val){
      crowdsaleSupply = val.toNumber();
    });
  });

  it("should accept 2 ether for the crowdsale", async function() {
      // 0 indicates all crowdsale tokens
      await token.setCrowdsale(sale.address, 0); // ensures crowdsale has allowance of tokens

      var amountEther = 2;
      var amountWei = web3.toWei(amountEther, "ether");

      let allowance = (await token.allowance(tokenOwner, sale.address)).toNumber();

      await sale.sendTransaction({from: user2,  value: web3.toWei(amountEther, "ether")});

      let allowanceAfter = (await token.allowance(tokenOwner, sale.address)).toNumber();
      let user2BalanceAfter = (await token.balanceOf(user2)).toNumber();
      let ownerBalanceAfter = (await token.balanceOf(owner)).toNumber();

      assert.equal(allowance - (amountWei * rate), allowanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, amountWei * rate, "The user should have gained amountWei*rate miniQSP");
      assert.equal(allowanceAfter + user2BalanceAfter, allowance, "The total tokens should remain the same");
  });

  it("should accept another 10 ether, reaching the goal", async function() {
      var amountEther = 10;
      var amountWei = web3.toWei(amountEther, "ether");

      let allowance = (await token.allowance(tokenOwner, sale.address)).toNumber();

      await sale.sendTransaction({from: user2,  value: web3.toWei(amountEther, "ether")});

      let allowanceAfter = (await token.allowance(tokenOwner, sale.address)).toNumber();
      let user2BalanceAfter = (await token.balanceOf(user2)).toNumber();
      let ownerBalanceAfter = (await token.balanceOf(tokenOwner)).toNumber();

      assert.equal(allowance - (amountWei * rate), allowanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, web3.toWei(12, "ether") * rate, "The user should have gained amountWei*rate miniQSP");
      assert.equal(allowanceAfter + user2BalanceAfter, crowdsaleSupply, "The total tokens should remain the same");
  });

  it("should transfer the ether balance of the sale crowdsale back to the owner", async function() {
      let saleEthBalance = (await web3.eth.getBalance(sale.address)).toNumber();
      let ownerEthBalance = (await web3.eth.getBalance(owner)).toNumber();

      await sale.ownerSafeWithdrawal();

      let saleBalanceAfter = (await web3.eth.getBalance(sale.address)).toNumber();
      let ownerBalanceAfter = (await web3.eth.getBalance(owner)).toNumber();

      assert.equal(saleBalanceAfter, 0, "The crowdsale should no longer have ether associated with it");
      assert.isAbove(ownerBalanceAfter, ownerEthBalance, "The owner should have gained that amount of ether (minus a bit for gas)");
  });

  it("the owner of QuantstampToken should now issue allowance to a new crowdsale", async function() {
      sale2 = await QuantstampSale.new(accounts[0], 10, 20, 60, 50, token.address);
      await token.setCrowdsale(sale2.address, 0); // ensures crowdsale has allowance of tokens

      let saleAllowance = (await token.allowance(tokenOwner, sale.address)).toNumber();
      let sale2Allowance = (await token.allowance(tokenOwner, sale2.address)).toNumber();

      let crowdsaleAllowance = (await token.crowdSaleAllowance()).toNumber();

      assert.equal(saleAllowance, 0, "The old crowdsale should have zero allowance");
      assert.isAbove(sale2Allowance, 0, "The new crowdsale should have an allowance greater than zero");
      assert.equal(sale2Allowance, crowdsaleAllowance, "The new crowdsale should have a balance equal to the current allowance");
      assert.isBelow(sale2Allowance, crowdsaleSupply, "The new crowdsale should have a balance less than the supply");
  });

  it("should accept 2 ether for the new crowdsale", async function() {
      var amountEther = 2;
      var amountWei = web3.toWei(amountEther, "ether");

      let allowance = (await token.allowance(tokenOwner, sale2.address));
      let sale2_rate = (await sale2.rate());

      let user2Balance = (await token.balanceOf(user2)).toNumber();

      await sale2.sendTransaction({from: user2,  value: web3.toWei(amountEther, "ether")});


      let allowanceAfter = (await token.allowance(tokenOwner, sale2.address));
      let user2BalanceAfter = (await token.balanceOf(user2)).toNumber();
      let ownerBalanceAfter = (await token.balanceOf(owner)).toNumber();

      let weiTransferred = (amountWei * sale2_rate);

      let sum = bigInt(allowanceAfter).add(weiTransferred);

      //assert.equal(allowance - diff, allowanceAfter, "The crowdsale should have sent amountWei*rate miniQSP");
      assert.equal(user2BalanceAfter, user2Balance + (amountWei * sale2_rate), "The user should have gained amountWei*rate miniQSP");
      assert.equal(sum.toNumber(), allowance, "The total tokens should remain the same");
  });

});
