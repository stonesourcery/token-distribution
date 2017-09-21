pragma solidity ^0.4.15;

import './token/StandardToken.sol';
import './token/BurnableToken.sol';
import './ownership/Ownable.sol';


/**
 * The Quantstamp token (QSP) has a fixed supply and restricts the ability
 * to transfer tokens until the owner has called the enableTransfer()
 * function.
 *
 * The owner can associate the token with a token sale contract. In that
 * case, the token balance is moved to the token sale contract, which
 * in turn can transfer its tokens to contributors to the sale.
 */
contract QuantstampToken is StandardToken, BurnableToken, Ownable {

    string public constant name = "Quantstamp Token";
    string public constant symbol = "QSP";
    uint8 public constant decimals = 18;
    uint256 public constant INITIAL_SUPPLY = 1000000000 * (10 ** uint256(decimals));
    bool public transferEnabled = false;
    address crowdSaleAddr;

    // If transfer is enabled, then anybody can perform a transfer; otherwise,
    // only the owner can perform a transfer
    modifier onlyWhenTransferEnabled() {
        if (!transferEnabled) {
            require(msg.sender == owner || msg.sender == crowdSaleAddr);
        }
        _;
    }

    function QuantstampToken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = totalSupply; // owner initially has all tokens
    }

    function setCrowdsale(address _crowdSaleAddr) external onlyOwner {
        require(!transferEnabled);
        approve(crowdSaleAddr, 0);
        approve(_crowdSaleAddr, balances[owner]);
        crowdSaleAddr = _crowdSaleAddr;
    }

    // The owner can enable the ability for anyone to transfer tokens.
    // Once enabled, it cannot be disabled again.
    function enableTransfer() external onlyOwner {
        transferEnabled = true;
    }

    function transfer(address _to, uint256 _value) public onlyWhenTransferEnabled returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public onlyWhenTransferEnabled returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    function burn(uint256 _value) public onlyWhenTransferEnabled {
        super.burn(_value);
    }
}