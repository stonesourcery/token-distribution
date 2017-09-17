var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {
  it("should set the testValue to 200", function() {
      var account_two = accounts[2];
      var amount = 123;
      var end_amount = 200;
      Quantstamp.deployed().then(function(instance) {
          quantstamp = instance;
          return quantstamp.testValue.call();
      }).then(function(value) {
          quantstamp.setTestValue(amount + 77);
      }).then(function() {
          return quantstamp.testValue.call();
      }).then(function(testValue){
          console.log("testValue: " + testValue);
          assert.equal(testValue, end_amount, "Amount wasn't correctly sent to the receiver");
      })
  });


  it("should send 111 wei to the crowdfunding campaign", function() {
      var account_two = accounts[2];
      var amount = 111;
      Quantstamp.deployed().then(function(instance) {
        quantstamp = instance;
        console.log("AGAIN: " + account_two + " " + amount);
        quantstamp.send(web3.toWei(1, "ether"));
      }).then(function() {
        return quantstamp.amountRaised.call();
      }).then(function(value){
        console.log("amountRaised: " + value)
          assert.equal(value, amount, "AmountRaised is not equal to the amount transferred");
      })
  });
});
