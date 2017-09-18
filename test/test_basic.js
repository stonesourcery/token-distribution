
var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {
  it("should set the testValue to 200", function(done) {
      var account_two = accounts[2];
      var amount = 123;
      var end_amount = 200;

      Quantstamp.deployed().then(function(instance) {
          quantstamp = instance;
          return quantstamp.testValue.call();
      }).then(function(value) {
          return quantstamp.setTestValue(amount + 77);
      }).then(function(result) {
          console.log("set test event: " + result.logs[0].event);
          return quantstamp.testValue.call();
      }).then(function(testValue){
          console.log("testValue: " + testValue);
          assert.equal(testValue, end_amount, "Amount wasn't correctly sent to the receiver");
      }).then(done).catch(done);
  });
  
});
