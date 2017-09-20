
var QuantstampToken = artifacts.require("./QuantstampToken.sol");
var QuantstampSale = artifacts.require("./QuantstampSale.sol");
var bigInt = require("big-integer");


const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}

contract('QuantstampToken', function(accounts) {
  // account[0] points to the owner on the testRPC setup
  var owner = accounts[0];
  var user1 = accounts[1];
  var user2 = accounts[2];
  var user3 = accounts[3];

  it("should not allow a regular user to transfer before they are enabled", async function() {
      let token = await QuantstampToken.deployed();
      try{
        await token.transfer(user2, 10, {from: user1});
      }
      catch (e){
        return true;
      }
      throw new Error("a regular user transferred before they were enabled")
  });

  it("should have an initial owner balance of 1 billion tokens", async function() {
      let token = await QuantstampToken.deployed();
      let ownerBalance = await token.balanceOf(owner);
      // 1 billion * 1 miniQSP => (10 ** 9) * (10 ** 18) = (10 ** 27)
      assert.equal(ownerBalance, 10**27, "the owner balance should initially be 1 billion tokens");
  });

  it("should allow the deployer (owner) of the token to make transfers", async function() {
      let token = await QuantstampToken.deployed();
      let sale = await QuantstampSale.deployed();
      await token.transfer(sale.address, 10 ** 26);
      let ownerBalance = await token.balanceOf(owner);
      let saleBalance = await token.balanceOf(sale.address);
      let initialSupply = await token.INITIAL_SUPPLY();
      let totalSupply = await token.totalSupply();
      ownerBalance = ownerBalance.toNumber();
      saleBalance = saleBalance.toNumber();
      initialSupply = initialSupply.toNumber();
      totalSupply = totalSupply.toNumber();

      assert.equal(ownerBalance, bigInt("9e26"), "the owner should now have 90% of the original funds");
      assert.equal(saleBalance, 10 ** 26, "the crowdSale should now have 10% of the original funds");
      assert.equal(totalSupply, initialSupply, "the total supply should equal the initial supply");

  });

  it("should not allow a regular user to enable transfers", async function() {
      let token = await QuantstampToken.deployed();
      try{
        await token.enableTransfer({from: user1});
      }
      catch (e){
        return true;
      }
      throw new Error("a regular user was able to call enableTransfer")
  });

  it("should enable transfers after invoking enableTransfer as owner", async function() {
      let token = await QuantstampToken.deployed();
      let isEnabledBefore = await token.transferEnabled();
      assert(!isEnabledBefore, "transfers should not be enabled");
      await token.enableTransfer();
      let isEnabledAfter = await token.transferEnabled(); 
      assert(isEnabledAfter, "transfers should be enabled");
  });

});
