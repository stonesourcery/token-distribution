pragma solidity ^0.4.15;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Ownable.sol";
import "../contracts/Pausable.sol";

import "../contracts/StandardToken.sol";
import "../contracts/Quantstamp.sol";






contract TestQuantstamp {
  // Truffle will send the TestContract one Ether after deploying the contract.
  uint public initialBalance = 1 ether;

  function testBasicTransfer() {
    Quantstamp quantstamp = Quantstamp(DeployedAddresses.Quantstamp());
    address addr3 = 0x0000000000000000000000000000000000000000000000000000000000000003;
    // perform an action which sends value to myContract, then assert.
    uint sendAmt = 111;

    quantstamp.transfer(sendAmt);
    Assert.equal(quantstamp.amountRaised(), sendAmt, "someValue should have been 111");

  }

  function () {
    // This will NOT be executed when Ether is sent. \o/
  }
}
