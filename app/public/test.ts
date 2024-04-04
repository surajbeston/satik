
import * as solanaWeb3 from "@solana/web3.js";

console.log(solanaWeb3);
const connection = new solanaWeb3.Connection("https://api.devnet.solana.com", "confirmed");
console.log(connection)
