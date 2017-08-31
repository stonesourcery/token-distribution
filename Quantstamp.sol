pragma solidity ^0.4.13;

import "./StandardToken.sol"

/**
 * A crowdsale contract for Quantstamp
 */
contract Quantstamp is StandardToken, Ownable, Pausable
{
    // After the deadline, the funds will be sent to the beneficiary
    address public beneficiary;

    // Parameters of the crowdsale
    uint public fundingGoal;
    uint public fundingCap;
    uint public amountRaised;
    uint public deadline;
    uint public price;

    // The token reward
    StandardToken public tokenReward;
    mapping(address => uint256) public balanceOf;

    // Crowdsale status
    bool fundingGoalReached = false;
    bool fundingCapReached = false;
    bool crowdsaleClosed = false;

    // Crowdsale events
    event GoalReached(address beneficiary, uint amountRaised);
    event CapReached(address beneficiary, uint amountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    /**
     * Initializes the crowdsale with the specified parameters.
     */
    function Quantstamp(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint fundingCapInEthers,
        uint durationInMinutes,
        uint etherCostOfEachToken,
        token addressOfTokenUsedAsReward)
    {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        fundingCap = fundingCapInEthers * 1 ether;
        deadline = now + durationInMinutes * 1 minutes;
        price = etherCostOfEachToken * 1 ether;
        tokenReward = token(addressOfTokenUsedAsReward);
    }

    /**
     * @dev Modifier to allow actions only when the contract passed the deadline
     */
    modifier afterDeadline()
    {
        if (now >= deadline || crowdsaleClosed) _;
    }

    /**
     * This default function is called whenever anyone sends
     * funds to a contract.
     */
    function () payable whenNotPaused
    {
        require (!crowdsaleClosed);
        uint amount += msg.value;

        // Ensure that amout raised cannot exceed cap
        if (amountRaised.plus(amount) > fundingCap)
        {
            amount = fundingCap.minus(amountRaised);
        }

        balanceOf[msg.sender] += amount;
        amountRaised += amount;
        tokenReward.transfer(msg.sender, amount / price);
        FundTransfer(msg.sender, amount, true);

        // Check if cap was reached. If so, end the crowdsale.
        if (amountRaised >= fundingCap)
        {
            fundingCapReached = true;
            CapReached(beneficiary, amountRaised);
            crowdsaleClosed = true;
        }
    }

    /**
     * @dev Checks if the goal or time limit has been reached and ends the campaign
     */
    function checkGoalReached() afterDeadline
    {
        if (amountRaised >= fundingGoal)
        {
            fundingGoalReached = true;
            GoalReached(beneficiary, amountRaised);
        }
        crowdsaleClosed = true;
    }

    /**
     * If the deadline has been reached, this function sends the funds
     * to the beneficiary. This function needs to be explicitly called
     * after the deadline has been reached.
     */
    function safeWithdrawal() afterDeadline
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

        if (fundingGoalReached && beneficiary == msg.sender)
        {
            // Send the funds to the beneficiary
            if (beneficiary.send(amountRaised))
            {
                FundTransfer(beneficiary, amountRaised, false);
            }
            else
            {
                // Funders' balances unlocked if fail to send to beneficiary
                fundingGoalReached = false;
            }
        }
    }

    /**
     * Permits the owner to distribute tokens to a specified address.
     */
    function distributeTokens(address to, uint value) onlyOwner
    {
        tokenReward.transfer(to, value);
    }
}