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

### Pre-sale

On September 29th, 2017 @ 9PM PST and ending on October 29th (or when sold old, whichever comes first), Quantstamp will have a pre-sale for the QSP token. The conversion rate from QSP to ETH will change during the course of the pre-sale according to the following schedule.

* Week 1: `1 ETH = 10,000 QSP`
* Week 2: `1 ETH =  9,000 QSP`
* Week 3: `1 ETH =  8,000 QSP`
* Week 4: `1 ETH =  7,000 QSP`

The `QuantstampSale.sol` file contains the code for a crowdsale. The default fallback function is executed when payment is received. This function will calculate the number of tokens to be distributed to the contributor based on the conversion rate as specified above.

The pre-sale will have a $3 million capacity. The equivalent amount of ETH will be determined within the 24-hour period prior to the pre-sale.

### Token Sale

In the near future, this document will be updated with additional information regarding the main token sale for QSP.

Copyright 2017 Quantstamp Technologies Inc. All Rights Reserved.
