pragma solidity ^0.4.13;

import "./StandardToken.sol"
import "./PricingStrategy.sol"

/**
 * A crowdsale contract for Quantstamp
 */
contract Quantstamp is StandardToken, Ownable, Pausable
{
    // Funds will be sent to the beneficiary
    address public beneficiary;

    // Parameters of the crowdsale
    uint public fundingGoal;
    uint public fundingCap;
    uint public amountRaised;
    uint public deadline;
    PricingStrategyInfo public pricingStrategy;

    // The token reward
    StandardToken public tokenReward;

    // Map of funders to contribution amount
    mapping(address => uint256) public balanceOf;

    // Crowdsale status
    bool fundingGoalReached = false;
    bool fundingCapReached = false;
    bool crowdsaleClosed = false;

    // Crowdsale events
    event GoalReached(address beneficiary, uint amountRaised);
    event CapReached(address beneficiary, uint amountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    // Modifiers
    modifier fundGoalReached() { if (fundingGoalReached) _; }
    modifier crowdSaleNotClosed() { if (!crowdsaleClosed && now <= deadline) _; }
    modifier crowdsaleClosed() { if (crowdsaleClosed || now > deadline) _; }


    /**
     * Initializes the crowdsale with the specified parameters.
     */
    function Quantstamp(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint fundingCapInEthers,
        uint durationInMinutes,
        PricingStrategy strategy,
        token addressOfTokenUsedAsReward)
    {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        fundingCap = fundingCapInEthers * 1 ether;
        deadline = now + durationInMinutes * 1 minutes;
        pricingStrategy = strategy;
        tokenReward = token(addressOfTokenUsedAsReward);
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
        uint tokenAmount = PricingStrategy.getTokenBonusAmount(pricingStrategy, amount);
        tokenReward.transfer(msg.sender, tokenAmount);
        FundTransfer(msg.sender, amount, true);

        // Has the funding goal been reached?
        fundingGoalReached = amountRaised >= fundingGoal;

        // Has the funding cap been reached? If so, end the crowdsale.
        if (amountRaised >= fundingCap)
        {
            fundingCapReached = true;
            CapReached(beneficiary, amountRaised);
            crowdsaleClosed = true;
        }
    }


    /**
     * Allows the owner to withdraw funds if and only if
     * the funding goal has been reached.
     */
    function ownerWithdrawal(uint value) external onlyOwner fundGoalReached
    {
        if (balanceOf[msg.sender] >= value) {
            if (beneficiary.send(value))
            {
                balanceOf[msg.sender] -= value;
                FundTransfer(beneficiary, value, false);
            }
        }
    }

    /**
     * Allows the owner to withdraw all funds if and only if
     * the funding goal has been reached.
     */
    function ownerWithdrawalAll() external onlyOwner fundGoalReached
    {
        ownerWithdrawal(balanceOf[msg.sender]);
    }

    /**
     * Allows funders to withdrawal committed funds after the crowdsale
     * is closed. A withdrawal can only be done if the minimum funding
     * goal was NOT reached.
     */
    function safeWithdrawal() external crowdsaleClosed
    {
        if (!fundingGoalReached)
        {
            uint amount = balanceOf[msg.sender];
            if (amount > 0)
            {
                // Send the funds back to funder
                if (msg.sender.send(amount))
                {
                    balanceOf[msg.sender] = 0;
                    FundTransfer(msg.sender, amount, false);
                }
            }
        }
    }

    /**
     * Permits the owner to distribute available tokens to a specified address.
     */
    function distributeTokens(address to, uint value) public onlyOwner
    {
        tokenReward.transfer(to, value);
    }


    /**
     * Permits the owner to change the pricing strategy
     */
    function updatePricingStrategy(PricingStrategyInfo strategy) external onlyOwner
    {
        pricingStrategy = strategy;
    }
}