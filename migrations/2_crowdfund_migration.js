var ERC20Lib = artifacts.require("./ERC20Lib.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");
var StandardToken = artifacts.require("./StandardToken.sol");

var Ownable = artifacts.require("./Ownable.sol");
var Pausable = artifacts.require("./Pausable.sol");

var PricingStrategy = artifacts.require("./PricingStrategy.sol");
var Quantstamp = artifacts.require("./Quantstamp.sol");

module.exports = function(deployer) {
    deployer.deploy(SafeMathLib);

    deployer.deploy(Ownable);
    deployer.link(Ownable, Pausable);
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
    deployer.link(Ownable, Quantstamp);
    deployer.link(Pausable, Quantstamp);

    //deployer.deploy(Quantstamp);
    deployer.deploy(Quantstamp, 0x7e5f4552091a69125d5dfcb7b8c2659029395bdf, 1000, 100000, 60);
};
