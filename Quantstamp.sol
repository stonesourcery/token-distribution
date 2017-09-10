pragma solidity ^0.4.15;

import "./StandardToken.sol";
import "./PricingStrategy.sol";
import "./SafeMathLib.sol";

/**
 * A crowdsale contract for Quantstamp
 */
contract Quantstamp is StandardToken, Ownable, Pausable
{
    using SafeMathLib for *;

    // Funds will be sent to the beneficiary
    address public beneficiary;

    // Attributes of the crowdsale
    uint public fundingGoal;
    uint public fundingCap;
    uint public amountRaised;
    uint public deadline;
    PricingStrategy.PricingStrategyInfo pricingInfo;

    // The token reward
    StandardToken public tokenReward;

    // Map of funders to contribution amount
    mapping(address => uint) public balanceOf;

    // Crowdsale status
    bool public fundingGoalIsReached = false;
    bool public fundingCapIsReached = false;
    bool public crowdsaleIsClosed = false;

    // Crowdsale events
    event GoalReached(address addr, uint amount);
    event CapReached(address addr, uint amount);
    event FundTransfer(address backer, uint amount, bool isContribution);

    // Modifiers
    modifier fundGoalReached() { if (fundingGoalIsReached) _; }
    modifier fundGoalNotReached() { if (!fundingGoalIsReached) _; }
    modifier fundingCapReached() { if (fundingCapIsReached) _; }
    modifier fundingCapNotReached() { if (!fundingCapIsReached) _; }
    modifier crowdSaleNotClosed() { if (!crowdsaleIsClosed && now <= deadline) _; }
    modifier crowdsaleClosed() { if (crowdsaleIsClosed || now > deadline) _; }


    /**
     * Initializes the crowdsale with the specified parameters.
     */
    function Quantstamp(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint fundingCapInEthers,
        uint durationInMinutes,
        uint[] pricingStrategyTierAmounts,
        uint[] pricingStrategyTierBonuses,
        uint   pricingStrategyTierCount)
        // address addressOfTokenUsedAsReward)
    {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        fundingCap = fundingCapInEthers * 1 ether;
        deadline = now + durationInMinutes * 1 minutes;
        PricingStrategy.updatePricingStrategy(pricingInfo, pricingStrategyTierAmounts, pricingStrategyTierBonuses, pricingStrategyTierCount);
        // tokenReward = token(addressOfTokenUsedAsReward);
    }

    /**
     * This default function is called whenever anyone sends funds to a contract.
     */
    function () payable whenNotPaused crowdSaleNotClosed
    {
        uint amount = msg.value;

        // Ensure that amount raised cannot exceed cap
        if (amountRaised.plus(amount) > fundingCap)
        {
            amount = fundingCap.minus(amountRaised);
        }

        balanceOf[msg.sender] += amount;
        amountRaised += amount;

        // Transfer tokens to sender
        uint tokenAmount = PricingStrategy.getTokenBonusAmount(pricingInfo, amount);
        tokenReward.transfer(msg.sender, tokenAmount);
        FundTransfer(msg.sender, amount, true);

        // Has the funding goal been reached?
        fundingGoalIsReached = amountRaised >= fundingGoal;

        // Has the funding cap been reached? If so, end the crowdsale.
        if (amountRaised >= fundingCap)
        {
            fundingCapIsReached = true;
            CapReached(beneficiary, amountRaised);
            crowdsaleIsClosed = true;
        }
    }


    /**
     * Allows the owner to withdraw funds if and only if the funding goal has
     * been reached. Note that this function may be called regardless of
     * whether or not the contract has been paused.
     *
     * &modifier external This function has external scope
     * &modifier onlyOwner Only the owner can call this function
     * &modifier fundGoalReached Only executes if funding goal is reached
     *
     * @param value The amount to be withdrawn
     */
    function ownerWithdrawal(uint value) external onlyOwner fundGoalReached
    {
        require (balanceOf[msg.sender] >= value);
        uint preAmount = balanceOf[beneficiary];

        if (beneficiary.send(value))
        {
            balanceOf[msg.sender] -= value;
            FundTransfer(beneficiary, value, false);
        }

        assert (balanceOf[beneficiary] == value + preAmount);
    }

    /**
     * Allows the owner to withdraw ALL funds, except the specified amount,
     * if and only if the funding goal has been reached. The withdrawn
     * amount is sent to the beneficiary.
     *
     * &modifier external This function has external scope
     * &modifier onlyOwner Only the owner can call this function
     * &modifier fundGoalReached Only executes if funding goal is reached
     *
     * @param exceptAmount All funds are withdrawn except for this amount
     */
    function ownerWithdrawalAll(uint exceptAmount) external onlyOwner fundGoalReached
    {
        require (exceptAmount <= balanceOf[msg.sender]);

        uint preAmount = balanceOf[beneficiary];
        uint withdrawAmount = balanceOf[owner] - exceptAmount;

        if (beneficiary.send(withdrawAmount))
        {
            balanceOf[owner] -= withdrawAmount;
            FundTransfer(beneficiary, withdrawAmount, false);
        }

        assert (balanceOf[owner] == exceptAmount);
        assert (balanceOf[beneficiary] == withdrawAmount + preAmount);
    }

    /**
     * Allows funders to withdrawal committed funds after the crowdsale
     * is closed. A withdrawal can only be done if the minimum funding
     * goal was NOT reached.
     *
     * &modifier external This function has external scope
     * &modifier crowdSaleClosed Only executes when the crowdsale is closed
     * &modifier fundGoalNotReached Only executes if the funding goal has not been reached
     */
    function safeWithdrawal() external crowdsaleClosed fundGoalNotReached
    {
            uint withdrawAmount = balanceOf[msg.sender];
            if (withdrawAmount > 0)
            {
                // Send the funds back to funder
                if (msg.sender.send(withdrawAmount))
                {
                    balanceOf[msg.sender] = 0;
                    FundTransfer(msg.sender, withdrawAmount, false);
                }
            }

            assert (balanceOf[msg.sender] == 0);
    }

    /**
     * Permits the owner to transfer the specified amount (value) of tokens
     * to the recipient (to).
     *
     * &modifier onlyOwner Only the owner can call this function
     *
     * @param to The address of the recipient of the tokens
     * @param value The amount of tokens distributed
     */
    function distributeTokens(address to, uint value) external onlyOwner
    {
        tokenReward.transfer(to, value);
    }

    /**
    * Permits the owner to change the pricing strategy
    * TODO: does this have to be external?
    */
    function updatePricingStrategy(uint[] amounts, uint[] rewards, uint count) external onlyOwner
    {
        PricingStrategy.updatePricingStrategy(pricingInfo, amounts, rewards, count);
    }

}