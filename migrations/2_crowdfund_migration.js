var ERC20Lib = artifacts.require("./ERC20Lib.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");
var StandardToken = artifacts.require("./StandardToken.sol");

var Ownable = artifacts.require("Ownable");
var Pausable = artifacts.require("Pausable");

var PricingStrategy = artifacts.require("./PricingStrategy.sol");
var Quantstamp = artifacts.require("./Quantstamp.sol");

module.exports = function(deployer) {
    deployer.deploy(SafeMathLib);

    deployer.deploy(Ownable);
    deployer.deploy(Pausable);

    deployer.link(SafeMathLib, ERC20Lib);
    deployer.deploy(ERC20Lib);
    

    deployer.link(ERC20Lib, StandardToken);
    //deployer.deploy(StandardToken, "QuantstampToken", "QSP", 10, 1000000000); // TODO: fill in appropriate values
    deployer.deploy(StandardToken);

    deployer.link(SafeMathLib, PricingStrategy);
    deployer.deploy(PricingStrategy);

    deployer.link(SafeMathLib, Quantstamp);
    deployer.link(PricingStrategy, Quantstamp);
    deployer.link(StandardToken, Quantstamp);
    deployer.deploy(Quantstamp);
};
