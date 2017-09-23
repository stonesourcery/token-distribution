// Quantstamp Technologies Inc. (info@quantstamp.com)

pragma solidity ^0.4.15;

import './lifecycle/Pausable.sol';
import './math/SafeMath.sol';
import './QuantstampToken.sol';

/**
 * The QuantstampSale smart contract is used for selling QuantstampToken
 * tokens (QSP). It does so by converting ETH received into a quantity of
 * tokens that are transferred to the contributor via the ERC20-compatible
 * transferFrom() function.
 */
contract QuantstampSale is Pausable {

    using SafeMath for uint256;

    // The beneficiary is the future recipient of the funds
    address public beneficiary;

    // The crowdsale has a funding goal, cap, and deadline
    uint public fundingGoal;
    uint public fundingCap;
    uint public deadline;
    bool public fundingGoalReached = false;
    bool public fundingCapReached = false;
    bool public saleClosed = false;

    // Keeps track of the amount of wei raised
    uint public amountRaised;

    // The ratio of QSP to Ether
    uint public rate;
    uint public constant LOW_RANGE_RATE = 5000;
    uint public constant HIGH_RANGE_RATE = 10000;

    // The token being sold
    QuantstampToken public tokenReward;

    // A map that tracks the amount of wei contributed by address
    mapping(address => uint256) public balanceOf;

    // Events
    event GoalReached(address _beneficiary, uint _amountRaised);
    event CapReached(address _beneficiary, uint _amountRaised);
    event FundTransfer(address _backer, uint _amount, bool _isContribution);

    // Modifiers
    modifier beforeDeadline()   { require (now < deadline); _; }
    modifier afterDeadline()    { require (now >= deadline); _; }
    modifier saleNotClosed()    { require (!saleClosed); _; }

    /**
     * Constructor for a crowdsale of QuantstampToken tokens.
     *
     * @param ifSuccessfulSendTo    the beneficiary of the fund
     * @param fundingGoalInEthers   the minimum goal to be reached
     * @param fundingCapInEthers    the cap (maximum) size of the fund
     * @param durationInMinutes     the duration of the crowdsale in minutes
     * @param rateQspToEther        the conversion rate from QSP to Ether
     * @param addressOfTokenUsedAsReward address of the token being sold
     */
    function QuantstampSale(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint fundingCapInEthers,
        uint durationInMinutes,
        uint rateQspToEther,
        address addressOfTokenUsedAsReward
    ) {
        require(ifSuccessfulSendTo != address(0));
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        fundingCap = fundingCapInEthers * 1 ether;
        deadline = now + durationInMinutes * 1 minutes;
        rate = rateQspToEther; //* 1 ether;
        tokenReward = QuantstampToken(addressOfTokenUsedAsReward);
    }

    /**
     * This fallback function is called whenever Ether is sent to the
     * smart contract. It can only be executed when the crowdsale is
     * not paused, not closed, and before the deadline has been reached.
     *
     * This function will update state variables for whether or not the
     * funding goal or cap have been reached. It also ensures that the
     * tokens are transferred to the sender, and that the correct
     * number of tokens are sent according to the current rate.
     */
    function () payable whenNotPaused beforeDeadline saleNotClosed {
        // Update the sender's balance of wei contributed and the amount raised
        uint amount = msg.value;
        balanceOf[msg.sender] += amount;
        amountRaised += amount;

        // Compute the number of tokens to be rewarded to the sender
        // Note: it's important for this calculation that both wei
        // and QSP have the same number of decimal places (18)
        uint numTokens = amount.mul(rate);

        // Transfer the tokens from the crowdsale supply to the sender
        tokenReward.transferFrom(tokenReward.owner(), msg.sender, numTokens);
        FundTransfer(msg.sender, amount, true);

        // Check if the funding goal or cap have been reached
        // TODO check impact on gas cost
        checkFundingGoal();
        checkFundingCap();
    }

    /**
     * The owner can terminate the crowdsale at any time.
     */
    function terminate() external onlyOwner {
        saleClosed = true;
    }

    /**
     * The owner can update the rate (QSP to ETH).
     *
     * @param _rate  the new rate for converting QSP to ETH
     */
    function setRate(uint _rate) external onlyOwner {
        require(_rate >= LOW_RANGE_RATE && _rate <= HIGH_RANGE_RATE);
        rate = _rate;
    }

    /**
     * The owner can transfer the specified amount of tokens from the
     * crowdsale supply to the recipient (_to).
     *
     * IMPORTANT: The argument isQSP indicates the units of the amount.
     * If set to true, then the amount is assumed to be in QSP, and
     * this function will automatically convert it to to mini-QSP;
     * otherwise, it is assumed that the amount is already in mini-QSP
     * and does not require conversion.
     *
     * @param _to      the recipient of the tokens
     * @param _amount  the amount to be sent
     * @param isQSP    if true, the units of _amount are QSP; otherwise, they are mini-QSP
     */
    function ownerTransferTokens(address _to, uint _amount, bool isQSP) external onlyOwner {
        uint numTokens = isQSP ? convertToMiniQsp(_amount) : _amount;
        tokenReward.transferFrom(tokenReward.owner(), _to, numTokens);
    }

    /**
     * The owner can call this function to withdraw the funds that
     * have been sent to this contract for the crowdsale subject to
     * the funding goal having been reached. The funds will be sent
     * to the beneficiary specified when the crowdsale was created.
     */
    function ownerSafeWithdrawal() external onlyOwner {
        require(fundingGoalReached);
        var balanceToSend = this.balance;
        if (beneficiary.send(balanceToSend)) {
            FundTransfer(beneficiary, balanceToSend, false);
        } else {
            // If we fail to send the funds to beneficiary, unlock funders balance
            // @TODO review this; what if we run out of gas for the send above?
            fundingGoalReached = false;
        }
    }

    /**
     * This function permits anybody to withdraw the funds they have
     * contributed if and only if the deadline has passed and the
     * funding goal was not reached.
     */
    function safeWithdrawal() external afterDeadline {
        if (!fundingGoalReached) {
            uint amount = balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            if (amount > 0) {
                if (msg.sender.send(amount)) {
                    FundTransfer(msg.sender, amount, false);
                } else {
                    balanceOf[msg.sender] = amount;
                }
            }
        }
    }

    /**
     * Checks if the funding goal has been reached. If it has, then
     * the GoalReached event is triggered.
     */
    function checkFundingGoal() internal {
        if (!fundingGoalReached) {
            if (amountRaised >= fundingGoal) {
                fundingGoalReached = true;
                GoalReached(beneficiary, amountRaised);
            }
        }
    }

    /**
     * Checks if the funding cap has been reached. If it has, then
     * the CapReached event is triggered.
     */
    function checkFundingCap() internal {
        if (!fundingCapReached) {
            if (amountRaised >= fundingCap) {
                fundingCapReached = true;
                saleClosed = true;
                CapReached(beneficiary, amountRaised);
            }
        }
    }

    /**
     * Given an amount in QSP, this method returns the equivalent amount
     * in mini-QSP.
     *
     * @param amount    an amount expressed in units of QSP
     */
    function convertToMiniQsp(uint amount) internal returns (uint) {
        return amount * (10 ** uint(tokenReward.decimals()));
    }
}
