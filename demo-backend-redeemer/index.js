import express from 'express'; 
import * as anchor from "@coral-xyz/anchor";

import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";

import fs from 'fs';

import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const app = express();

const idl = JSON.parse(fs.readFileSync('satik.json', 'utf8'));

const seeds = JSON.parse(fs.readFileSync('keypair.json', 'utf-8')).key;
const uintSeeds = Uint8Array.from(seeds)
const wallet =  anchor.web3.Keypair.fromSecretKey(uintSeeds);

const preflightCommitment = "processed";
const commitment = "confirmed";

const programID = new PublicKey(idl.metadata.address);

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=f34375fa-df6a-425f-8515-e619ad9c9839", commitment);

const provider = new AnchorProvider(connection, wallet.value, {
                        preflightCommitment,
                        commitment,
                    })

const program =  new Program(idl, programID, provider);

console.log(program.account)

const purchases = await program.account.purchase.all();

console.log(purchases);

app.get('/', async (req, res) => {
    const purchaseAddress = new PublicKey(req.query.purchaseAddress);
    const purchase = program.account.purchase.fetch(purchaseAddress);

    const redeemDatetimeAddress = new anchor.web3.Keypair.generate();
    const mint = new PublicKey("8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy");
    
    const tx6 = await program.methods.redeemAmount(bump)
                                    .accounts({
                                        redeemDatetime: redeemDatetimeAddress.publicKey,
                                        purchase: purchase,
                                        brandReceiver: purchase.brandReceiver,
                                        influencerReceiver: purchase.influencerReceiver,
                                        satikReceiver: purchase.satikReceiver,
                                        escrow: purchase.escrow,
                                        mint: mint,
                                        tokenProgram: TOKEN_PROGRAM_ID
                                    })
                                    .signers([redeemDatetimeAddress, wallet])
    res.send('Successful response.');
})



app.listen(3000, () => console.log('Example app is listening on port 3000.'));
