pragma solidity ^0.4.16;

contract Ownable
{
  address public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable()
  {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner()
  {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}

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
   * @dev modifier to allow actions only when the contract IS NOT paused
   */
  modifier whenNotPaused()
  {
    require(!paused);
    _;
  }

  /**
   * @dev modifier to allow actions only when the contract IS paused
   */
  modifier whenPaused
  {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused returns (bool)
  {
    paused = true;
    Pause();
    return true;
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused returns (bool)
  {
    paused = false;
    Unpause();
    return true;
  }
}