var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {
  it("should set the testValue to 200", function(done) {
      var account_two = accounts[2];
      var amount = 123;
      var end_amount = 200;
                console.log("a");

      Quantstamp.deployed().then(function(instance) {
          quantstamp = instance;
                          console.log("b");

          return quantstamp.testValue.call();
      }).then(function(value) {
          return quantstamp.setTestValue(amount + 77);
                          console.log("c");

      }).then(function(result) {
          console.log("set test event: " + result.logs[0].event);

          return quantstamp.testValue.call();
      }).then(function(testValue){
          console.log("testValue: " + testValue);
          assert.equal(testValue, end_amount, "Amount wasn't correctly sent to the receiver");
      }).then(done).catch(done);
  });


  it("should send 111 wei to the crowdfunding campaign", function(done) {
      var account_two = accounts[2];
      var amount = 1;
      Quantstamp.deployed().then(function(instance) {
        quantstamp = instance;
        console.log("AGAIN: " + account_two + " " + amount);
        return quantstamp.send(web3.toWei(amount, "ether"));
      }).then(function(result) {
        console.log(result.logs[0].event);
        console.log("Hit?");
        return quantstamp.amountRaised.call();
      }).then(function(value){
        console.log("amountRaised: " + value)
          assert.equal(value, amount, "AmountRaised is not equal to the amount transferred");
      }).then(done).catch(done);
  });
});
