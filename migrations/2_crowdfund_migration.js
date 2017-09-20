var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol");
var ERC20 = artifacts.require("./zeppelin/token/ERC20.sol");
var ERC20Basic = artifacts.require("./zeppelin/token/ERC20Basic.sol");
var BurnableToken = artifacts.require("./zeppelin/token/BurnableToken.sol");
var BasicToken = artifacts.require("./zeppelin/token/BasicToken.sol");
var StandardToken = artifacts.require("./zeppelin/token/StandardToken.sol");
var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Pausable = artifacts.require("./zeppelin/lifecycle/Pausable.sol");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");
var QuantstampSale = artifacts.require("./QuantstampSale.sol");

module.exports = function(deployer, network, accounts) {
    //console.log("Accounts: " + accounts);

    deployer.deploy(SafeMath);
    deployer.deploy(Ownable);
    deployer.link(Ownable, Pausable);
    deployer.deploy(Pausable);

    deployer.deploy(BasicToken);
    deployer.link(BasicToken, SafeMath);
    deployer.link(BasicToken, ERC20Basic);

    deployer.deploy(StandardToken);
    deployer.link(StandardToken, BasicToken);

    deployer.deploy(QuantstampToken);
    deployer.link(QuantstampToken, StandardToken);
    deployer.link(QuantstampToken, Ownable);

    deployer.deploy(QuantstampToken).then(
        function() {
            return deployer.deploy(QuantstampSale, accounts[0], 10, 20, 60, 100, QuantstampToken.address);
        }
    )

};
