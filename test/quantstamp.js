var Quantstamp = artifacts.require("./Quantstamp.sol");

contract('Quantstamp', function(accounts) {
<<<<<<< HEAD
  it("should set the funding goal to 123", function() {
=======
  it("should transfer 123 coins to Quantstamp from the 2nd account", function() {
>>>>>>> d196aafe5abba181ae341abcbad1f9a722294d99
      var account_two = accounts[2];
      var amount = 123;


<<<<<<< HEAD
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

=======
    return Quantstamp.deployed().then(function(instance) {
      quantstamp = instance;
        console.log("Test log statement");
        console.log(quantstamp.amountRaised());
        quantstamp.transfer(account_two, amount);
      assert.equal(quantstamp.amountRaised(), amount, "Amount wasn't correctly sent to the receiver");
    });
  });
>>>>>>> d196aafe5abba181ae341abcbad1f9a722294d99
});
