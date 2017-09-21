var SafeMath = artifacts.require("./math/SafeMath.sol");
var ERC20 = artifacts.require("./token/ERC20.sol");
var ERC20Basic = artifacts.require("./token/ERC20Basic.sol");
var BurnableToken = artifacts.require("./token/BurnableToken.sol");
var BasicToken = artifacts.require("./token/BasicToken.sol");
var StandardToken = artifacts.require("./token/StandardToken.sol");
var Ownable = artifacts.require("./ownership/Ownable.sol");
var Pausable = artifacts.require("./lifecycle/Pausable.sol");
var QuantstampToken = artifacts.require("./QuantstampToken.sol");
var QuantstampSale = artifacts.require("./QuantstampSale.sol");
var QuantstampICO = artifacts.require("./QuantstampICO.sol");


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
    deployer.link(QuantstampToken, BurnableToken);
    deployer.link(QuantstampToken, SafeMath);

    deployer.deploy(QuantstampToken).then(
        function() {
            return deployer.deploy(QuantstampSale, accounts[0], 10, 20, 60, 100, QuantstampToken.address);
        }).then(function(){
            return deployer.deploy(QuantstampICO, accounts[0], 10, 20, 60, 50, QuantstampToken.address);
        });



};
