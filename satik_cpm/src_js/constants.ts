import { Keypair } from "@solana/web3.js";

const secretKey: Uint8Array = Uint8Array.from([3, 56, 63, 68, 81, 160, 154, 157, 128, 2, 72, 186, 251, 171, 226, 102, 182, 29, 251, 244, 58, 77, 72, 68, 83, 164, 14, 145, 234, 162, 55, 140, 3, 8, 160, 88, 219, 109, 132, 72, 112, 22, 6, 84, 64, 168, 145, 138, 206, 227, 33, 239, 196, 210, 10, 223, 217, 85, 38, 27, 202, 246, 225, 150])
export const payerKeypair = Keypair.fromSecretKey(secretKey);
