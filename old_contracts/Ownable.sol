pragma solidity ^0.4.15;


/**
 * An ownable contract has an owner and the ownership can be transferred.
 * The "onlyOwner" modifier can be used to constrain access to a function
 * to the owner.
 */
contract Ownable
{
  address public owner;

  /**
   * The Ownable constructor sets the original `owner` of the
   * contract to the sender account.
   */
  function Ownable()
  {
    // whoever instantiates this contract is automatically made the owner
    owner = msg.sender;
  }


  /**
   * Throws if called by any account other than the owner.
   */
  modifier onlyOwner()
  {
    require(msg.sender == owner);
    _;
  }


  /**
   * Allows the current owner to transfer control of the contract to a newOwner.
   *
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}