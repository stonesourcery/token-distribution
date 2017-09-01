import "../SafeMathLib.sol";

library PricingStrategy
{
    struct PricingStrategyInfo
    {
        // Tiered bonuses
        uint[] tierBonusAmount;
        uint[] tierBonusReward;
        uint tierBonusCount;
    }

    /**
     * Given the specified amount of tokens, this function determines the amount
     * of bonus tokens that may be awarded based on current pricing strategy.
     *
     * The pricing strategy data structure makes no guarantees that the tier-related
     * data are sorted, so this function must step through all tiers to determine
     * the maximum bonus for the specified amount of tokens.
     */
    function getTokenBonusAmount(PricingStrategyInfo info, uint amountInTokens) returns(uint)
    {
        uint maxBonus = 0;
        uint count = info.tierBonusCount;

        for (uint i = 0; i < count; i++)
        {
            if (amount >= tierBonusAmount[i])
            {
                uint bonus = tierBonusReward[i];
                if (maxBonus < bonus)
                {
                    maxBonus = bonus;
                }
            }
        }

        return amountInTokens * (1 + maxBonus / 100);
    }

}