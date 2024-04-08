"use strict";
exports.__esModule = true;
var solanaWeb3 = require("@solana/web3.js");
console.log(solanaWeb3);
var connection = new solanaWeb3.Connection("https://api.devnet.solana.com", "confirmed");
console.log(connection);
