// Quantstamp Technologies Inc. (info@quantstamp.com)

pragma solidity ^0.4.15;

import '../QuantstampSale.sol';

/**
 * The QuantstampSale smart contract is used for selling QuantstampToken
 * tokens (QSP). It does so by converting ETH received into a quantity of
 * tokens that are transferred to the contributor via the ERC20-compatible
 * transferFrom() function.
 */
contract QuantstampSaleMock is QuantstampSale {

    uint public _now;

    function QuantstampSaleMock(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint fundingCapInEthers,
        uint minimumContributionInWei,
        uint start,
        uint durationInMinutes,
        uint rateQspToEther,
        address addressOfTokenUsedAsReward
    ) QuantstampSale(ifSuccessfulSendTo, fundingGoalInEthers, fundingCapInEthers,
                     minimumContributionInWei, start, durationInMinutes, rateQspToEther,
                     addressOfTokenUsedAsReward){ }

    function currentTime() returns (uint _currentTime) {
        return _now;
    }

    function changeTime(uint _newTime) {
        _now = _newTime;
    }
}
