pragma solidity ^0.4.15;

import "./Ownable.sol";

/**
 * A contract that inherits this attribute is said to be pausable. There is a state
 * variable that indicates whether or not the contract is paused.
 *
 * This contract specifies modifiers and functions that may be used by the contract
 * for pausing and unpausing, and for preventing/enabling the execution of functions
 * depending on the value of the pause state variable.
 */
contract Pausable is Ownable
{
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * A modifier that allows actions only when the contract IS NOT paused
   */
  modifier whenNotPaused()
  {
    require(!paused);
    _;
  }

  /**
   * A modifier that allows actions only when the contract IS paused
   */
  modifier whenPaused
  {
    require(paused);
    _;
  }

  /**
   * Called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused returns (bool)
  {
    paused = true;
    Pause();
    return true;
  }

  /**
   * Called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused returns (bool)
  {
    paused = false;
    Unpause();
    return true;
  }
}