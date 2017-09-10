pragma solidity ^0.4.15;


import "./SafeMathLib.sol";

library PricingStrategy
{
    struct PricingStrategyInfo
    {
        uint multiplier; // the amount of tokens per unit of Ether
    }


    /**
     * Returns the number of tokens to be reward based on the supplied
     * pricing strategy and amount of Ether contributed.
     */
    function getTokenReward(PricingStrategyInfo info, uint amountInEther) returns(uint)
    {
        return (amountInEther * 1 ether).times(multiplier);
    }
}