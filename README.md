# Quantstamp Token Sale

This document gives an overview of the smart contracts used for the Quantstamp token and crowdsales.

# Overview

## Quantstamp Token

The Quantstamp token smart contract `QuantstampToken.sol` is ERC20-compatible and has the following additional characteristics:

1. A fixed supply of pre-minted tokens
2. The ability to burn tokens by a user, removing the tokens from the supply
3. During the token sale period, regular users cannot transfer tokens
4. A crowdsale is given an allowance of tokens to be sold on behalf of the token owner

At the completion of the final token sale, Quantstamp plans to do the following:

1. Burn all unallocated tokens
2. Enable the ability to transfer tokens for everyone

Once these final two steps are performed, the distribution of tokens is complete.

### Implementation

We use OpenZeppelin code for `SafeMath`, `Ownable`, `Burnable` and `StandardToken` logic.

* `SafeMath` provides arithmetic functions that throw exceptions when integer overflow occurs
* `Ownable` keeps track of a contract owner and permits the transfer of ownership by the current owner
* `Burnable` provides a burn function that decrements the balance of the burner and the total supply
* `StandardToken` provides an implementation of the ERC20 standard

The token contract includes the following constants:

```javascript
    name             = "Quantstamp Token";
    symbol           = "QSP";
    decimals         = 18;
    INITIAL_SUPPLY   = 1 billion QSP
    CROWDSALE_SUPPLY = 650 million QSP
```

The above constants indicate a total supply of 1 billion pre-minted tokens. Of those, 650 million tokens are set aside as an allowance for crowdsale purposes.

## Quantstamp Crowdsale

The Quantstamp crowdsale smart contract may be used to sell QSP tokens. To begin a crowdsale, the token owner must call the `setCrowdsale()` function of the token contract, passing the address of the crowdsale and the requested allowance of tokens to be sold. Although ownership of the tokens is tied up in the token contract, the crowdsale is given an allowance of tokens from the crowdsale supply and thus is able to transfer tokens to users.

### Token sale

To learn more about the token sale, please visit [here](https://medium.com/quantstamp/announcing-proof-of-caring-9fa3209854ff).



Copyright 2017 Quantstamp Technologies Inc. All Rights Reserved.
