pragma solidity ^0.4.13;

import './ERC20Lib.sol';
import "./Security.sol"

contract StandardToken
{
   using ERC20Lib for ERC20Lib.TokenStorage;

   // The ERC20 token
   ERC20Lib.TokenStorage token;

   // Token metadata
   string public name;
   string public symbol;
   uint public decimals;
   uint public tokenSupply;

   function StandardToken(
      string public tokenName,
      string public tokenSymbol,
      uint8 public decimalUnits,
      uint256 public initialSupply)
    {
      name = tokenName;
      symbol = tokenSymbol;
      decimals = decimalUnits;
      tokenSupply = initialSupply;
      token.init(totalSupply);
   }

   function totalSupply() constant returns (uint)
   {
     return token.totalSupply;
   }

   function balanceOf(address who) constant returns (uint)
   {
     return token.balanceOf(who);
   }

   function allowance(address owner, address spender) constant returns (uint)
   {
     return token.allowance(owner, spender);
   }

   function transfer(address to, uint value) returns (bool ok)
   {
     return token.transfer(to, value);
   }

  function transferFrom(address from, address to, uint value) returns (bool ok)
  {
    return token.transferFrom(from, to, value);
  }

  function approve(address spender, uint value) returns (bool ok)
  {
    return token.approve(spender, value);
  }

   event Transfer(address indexed from, address indexed to, uint value);
   event Approval(address indexed owner, address indexed spender, uint value);
 }