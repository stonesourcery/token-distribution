var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {
  it("should transfer 123 coins to Quantstamp from the 2nd account", function() {
      var account_two = accounts[2];
      var amount = 123;


    return Quantstamp.deployed().then(function(instance) {
      quantstamp = instance;
        console.log("Test log statement");
        console.log(quantstamp.amountRaised());
        quantstamp.transfer(account_two, amount);
      assert.equal(quantstamp.amountRaised(), amount, "Amount wasn't correctly sent to the receiver");
    });
  });
});
