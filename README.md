# Ethereum Smart Contract for Store Buxx 

This project demonstrates how to use an Ethereum Smart Contract to manage in-store tokens in support of a marketing campaign.
Customers are allowed to purchase store tokens that can be later redeemed for merchandise.
Retailers can also issue in store credits in the form of tokens.


The manual movement of money is replaced with an Ethereum smart contract implementing the following functions:
- **purchase** -  A customer purchases tokens using Ether, which is taken from the customer's account and transferred to the store owner's account. The number of tokens issued to the customer depends on the current price of ether. Each token is worth approximately 1 cent USD. The number of tokens purchased is added to the customer's token balance.
- **redeem** - The store owner redeems customer tokens for merchandise. The number of tokens redeemed is subtracted from the customer's token balance.
- **credit** - The store owner gives a customer a number of tokens as an in-store credit. The number of tokens credited is added to the customer's token balance.
- **halt** - The store owner temporarily suspends the purchase of tokens (in case of major Ether price drop!).
- **resume** - The store owner allows the resumption of token purchases.

## Development stack

This project was developed using Solidity v0.4.18, Truffle v4.0.4, and Ganache v1.0.1.

## Prerequisites

A text editor to edit `.sol` files. Visual Studio Code 1.19.2 used here.

## Build
From a command prompt opened to the source directory, run this command:

`truffle.cmd compile --all` 

## Tests
It is recommended to run the tests individually and to restart Ganache after each test.  This will avoid _Out of Gas_ conditions from occurring while running the tests.

From a command prompt opened to the source directory, run these commands:

`truffle.cmd test ./test/storeBuxxConversion.js`

`truffle.cmd test ./test/storeBuxxPurchase.js`

`truffle.cmd test ./test/storeBuxxRedeem.js`

`truffle.cmd test ./test/storeBuxxCredit.js`

`truffle.cmd test ./test/storeBuxxHalt.js`

`truffle.cmd test ./test/storeBuxxResume.js`

## Migrations
From a command prompt opened to the source directory, run this command to deploy to the default Ganache instance:

`truffle.cmd migrate --reset --network ganachedevelopment`

The network name is defined in `truffle.js`.

For testing purposes the contract owner address is hard coded in `2_deploy_contracts.js` using the value of the first test account supplied by Ganache. This is supplied to the contract constructor during deployment. In production, this address would need to be a real address on the Live Ethereum network.