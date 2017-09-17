var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {
  it("should set the funding goal to 123", function() {
      var account_two = accounts[2];
      var amount = 123;


        console.log("A");

      Quantstamp.deployed().then(function(instance) {
        quantstamp = instance;
        return quantstamp.fundingGoal.call();
      }).then(function(value) {
          console.log(value);
                console.log("B");

        quantstamp.setFundingGoal(amount);
                console.log("C");

      }).then(function() {
        console.log("Test log statement");
        console.log(quantstamp.fundingGoal.call());
        return quantstamp.fundingGoal.call();
      }).then(function(fundingGoal){
          console.log("fundingGoal: " + fundingGoal);
          console.log("quantstamp.fundingGoal.call(): " + quantstamp.fundingGoal.call());

          assert.equal(fundingGoal, amount, "Amount wasn't correctly sent to the receiver");
      })
  });


  it("should send 111 wei to the crowdfunding campaign", function() {
      var account_two = accounts[2];
      var amount = 111;


        console.log("A2");

      Quantstamp.deployed().then(function(instance) {
        quantstamp = instance;
                console.log("B2");

        quantstamp.transfer(amount);
        console.log("C2");
      }).then(function() {
        console.log("Test2 log statement");
        return quantstamp.amountRaised.call();
      }).then(function(value){
          assert.equal(value, amount, "AmountRaised is not equal to the amount transferred");
      })
  });

});
