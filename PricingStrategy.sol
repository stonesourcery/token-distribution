import "../SafeMathLib.sol";

library PricingStrategy
{
    struct PricingStrategyInfo
    {
        uint[] tierAmount;
        uint[] bonus;
        uint count;
    }

    function getTokenAmount(PricingStrategyInfo info, uint amount) returns(uint)
    {
        uint maxBonus = 0;
        for (uint i = 0; i < info.count; i++)
        {
            if (amount >= tierAmount[i])
            {
                uint bonus = bonus[i];
                if (maxBonus < bonus)
                {
                    maxBonus = bonus;
                }
            }
        }

        return amount * (1 + maxBonus / 100);
    }
}