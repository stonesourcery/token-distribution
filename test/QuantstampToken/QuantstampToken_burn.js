// Unit tests for the constructor

var bigInt = require("big-integer");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");
var QuantstampSale = artifacts.require("./QuantstampSale.sol");

contract('QuantstampToken.burn', function(accounts) {
    // account[0] points to the owner on the testRPC setup
    var owner = accounts[0];
    var user1 = accounts[1];

    beforeEach(
        function() {
            return QuantstampSale.deployed().then(
        function(instance) {
            sale = instance;
            return QuantstampToken.deployed();
        }).then(
        function(instance2){
            token = instance2;
            return token.INITIAL_SUPPLY();
        });
    });

    it("should not be callable when transfers are not enabled", async function() {
        try {
            await token.burn(1);
        }
        catch (e) {
            return true;
        }
        throw new Error("burn was called when transfers were not enabled");
    });

    // From here, transfers ARE enabled
    it("should burn a token from total supply", async function() {
        await token.enableTransfer();

        let oldTotalSupply = bigInt(await token.totalSupply());
        await token.burn(1);
        let newTotalSupply = bigInt(await token.totalSupply());

        assert.equal(oldTotalSupply - newTotalSupply, bigInt(1));
    });
});
