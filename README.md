# IZX minimum viable product

## IZX Project Stages

Contracts and Server code for IZX minimum viable product, MVP

IZX is the mobile application (http://izetex.io, https://izx.io ), operating with 
blockchain tokens as with the game artifact.

MVP for IZX project was built in 2 phases:

1) the first phase ( June - July, 2017 ) used the blockchain-based contract for charity 
collection and distribution

2) the second phase (July - August 2017 ) was a crypto-token for game in augmented reality (AR)

## Technology

IZX project blockchain infrastructure uses Ethereum Ropsten network and ERC-20 standard tokens

Token is deployed in Ropsten network at the following address:

https://ropsten.etherscan.io/token/0x2f2F58D05e6A94CEe2BfEA014B8c4e072b508a53

## Code

This project contains:

  * smart contract code, deployed on blockchain test network to operate the IZX MVP product
  
  * javascript code, exposing operations from game players ( mobile devices ) to
  the blockchain


## Blockchain Addresses

MVP uses the number of addresses to implement the logic of the game.
The game process can be described as:


 1) Advertiser buys tokens from manager
 2) Advertiser drops the tokens on the Earth
 3) Player looking for tokens on the earth, pick the from earth in own wallet
 4) Player gives tokens to advertiser in exchange to prize or offer
 
 The following addresses used to hold ERC-20 tokens:
 
 1) Manager ( Izetex )
 2) Advertiser
 3) Earth
 4) Player
 
 This project  makes transfers between these addresses during the game.
 