import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Satik } from "../target/types/satik";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { u32, u8, struct, blob, Layout } from "@solana/buffer-layout";
import { publicKey, u64, bool } from "@solana/buffer-layout-utils";
import { getAssociatedTokenAddress,
    createMint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAccount, 
    mintTo,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccount,
    transfer } from '@solana/spl-token';

import { BN } from 'bn.js';
import { assert } from "chai";


describe("satik", () => {

    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.Satik as Program<Satik>;

  //   program.provider.connection.onLogs(program.programId, (logs) => {
  //   for (var log of logs.logs) {
  //     if(log.includes("Program log:")) {
  //       log.replace("Program log: ", "");
  //       console.log(log);
  //     }
  //   }
  // })

    

    it("Initialize brand and influencer, create proposal and accept it", async () => {

        var payer = anchor.Wallet.local().payer;

        const mint = await createMint(
            program.provider.connection,
            payer,
            payer.publicKey,
            null,
            6
          );

          console.log("-------------")
          console.log("mint: ", mint.toBase58());
          console.log("Token Program Id", TOKEN_PROGRAM_ID);
          console.log("Associated Token Program", ASSOCIATED_TOKEN_PROGRAM_ID);


          const brandKP =  anchor.web3.Keypair.generate();

          const brandATA = await createAssociatedTokenAccount(
            program.provider.connection,
            payer,
            mint,
            brandKP.publicKey
          )
          console.log("Brand ATA: ", brandATA.toBase58());

          const influencerKP =  anchor.web3.Keypair.generate();
          const influencerATA = await createAssociatedTokenAccount(
            program.provider.connection,
            payer,
            mint,
            influencerKP.publicKey
          )
          console.log("Infuencer ATA: ", influencerATA.toBase58());

          const satikKP = anchor.web3.Keypair.generate();
           
          const satikATA = await createAssociatedTokenAccount(
            program.provider.connection,
            payer,
            mint,
            satikKP.publicKey
          );
          console.log("Satik ATA: ", satikATA.toBase58());

        const BRAND_USERNAME = (Math.random() + 1).toString(36).substring(7);
        const [brandAddress] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(BRAND_USERNAME)], program.programId);

        console.log("Address of brand is: ", brandAddress.toBase58());

        const INFLUENCER_USERNAME = (Math.random() + 1).toString(36).substring(7);
        const [influencerAddress] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(INFLUENCER_USERNAME)], program.programId);

        const tx = await program.methods.initializeBrand( BRAND_USERNAME,  'Not Brand', 'https://image.com/image.jpeg', "This my brand bio.")
                                        .accounts({
                                            brand: brandAddress,
                                            usdcAta: brandATA
                                        })
                                        .rpc()
        console.log("This is the transaction of brand: ", tx)

        const brand = await program.account.brand.fetch(brandAddress);

        assert(brand.username, BRAND_USERNAME);

        const tx1 = await program.methods
                                .initializeInfluencer(INFLUENCER_USERNAME,'Not Influencer', 'https://image.com/image.image', "I'm not a real influencer -)")
                                .accounts({
                                    influencer: influencerAddress,
                                    usdcAta: influencerATA
                                })
                                .rpc();
        console.log("This is the transaction of influencer: ", tx1);

        const influencer = await program.account.influencer.fetch(influencerAddress);
        assert(influencer, INFLUENCER_USERNAME);


        const proposalKeyPair = anchor.web3.Keypair.generate();
        const tx2 = await program.methods.initializeProposal("website", "message", payer.publicKey)
                                    .accounts({
                                        proposal: proposalKeyPair.publicKey,
                                        brand: brandAddress,
                                        influencer: influencerAddress
                                    })
                                    .signers([proposalKeyPair]) 
                                    .rpc()
        console.log("This is the address of proposal: ", proposalKeyPair.publicKey.toBase58());
        console.log("This is the transaction of proposal:", tx2);

        var fetchedProposal = await program.account.proposal.fetch(proposalKeyPair.publicKey);
        
        if (fetchedProposal.accepted !== false) { 
            throw new Error('Assertion failed: fetchedProposal.accepted should be false.');
        }
        
        const products = [{"name": "Suraj Jha", "description": "This is suraj", "total_amount": 100_000_000, "influencer_amount": 20_000_000}]
        const productKeyPair = anchor.web3.Keypair.generate();
        for(var product of products) {
            const tx3 = await program.methods.initializeProduct("product 1", "description", new BN(product.total_amount), new BN(product.influencer_amount))
                                        .accounts({
                                            product: productKeyPair.publicKey,
                                            proposal: proposalKeyPair.publicKey
                                        })
                                        .signers([productKeyPair])
                                        .rpc(); 
            console.log("This is the address of product: ", productKeyPair.publicKey.toBase58());
            console.log("This is the transaction of product:", tx3);
        }

        const tx3 = await program.methods.acceptProposal()
                                        .accounts({
                                            proposal: proposalKeyPair.publicKey
                                        })
                                        .rpc()

        console.log("Transaction while accepting proposal: ", tx3);

        fetchedProposal = await program.account.proposal.fetch(proposalKeyPair.publicKey);

        if (fetchedProposal.accepted !== true) {
            throw new Error('Assertion failed: fetchedProposal.accepted should be false.');
        }

        console.log("Getting customer ATA...");

        const customer_ATA = await createAssociatedTokenAccount(
            program.provider.connection,
            payer,
            mint, 
            payer.publicKey);

        console.log("Customer ATA: ", customer_ATA.toBase58());

        const tx5 = await mintTo(
            program.provider.connection,
            payer,
            mint,
            customer_ATA,
            payer.publicKey,
            100_000_000
          )

        console.log("Transaction of minting: ", tx5);

        const purchaseId = Math.random().toString(36).slice(2);

        const [purchaseAddress, bump] =  anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(purchaseId)], program.programId);

        const escrow = await getAssociatedTokenAddress(mint, purchaseAddress, true)
        
        console.log("Purchase address is: ", purchaseAddress.toBase58());
        console.log("Escrow ATA is: ", escrow.toBase58())

        // let signature = await transfer(
        //     program.provider.connection,
        //     payer,
        //     customer_ATA,
        //     escrow.address,
        //     payer.publicKey,
        //     50
        // );

        // console.log("Signature of the transaction is: ", signature)
    

        const tx4 = await program.methods.purchase(purchaseId)
                                    .accounts({
                                        purchase: purchaseAddress,
                                        proposal: proposalKeyPair.publicKey,
                                        product: productKeyPair.publicKey,
                                        brandAta: brandATA,
                                        influencerAta: influencerATA,
                                        customerAta: customer_ATA,
                                        usdcTokenAccount: escrow,
                                        mint: mint,
                                        tokenProgram: TOKEN_PROGRAM_ID,
                                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                                        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                                    })
                                    .signers([payer])
                                    .rpc({
                                      skipPreflight: true
                                    });

        console.log("Transaction of purchase is: ", tx4);

        const redeemDatetimeAddress = anchor.web3.Keypair.generate();

        let signer = payer;

        // await program.provider.connection.requestAirdrop(purchaseAddress, LAMPORTS_PER_SOL);
        // while (true){
        //   const purchaseBalance = await program.provider.connection.getBalance(purchaseAddress)
        //   console.log("Purchase Balance: ", purchaseBalance);
        //   if (purchaseBalance > 3166800) break
        // }

        console.log("Brand Receiver", brandATA.toBase58())
        console.log("Purchase Address", purchaseAddress.toBase58())
        console.log("Escrow Address", escrow.toBase58())

        console.log("Purchase id ", purchaseId);

        console.log("Bump is: ", bump)

        const tx6 = await program.methods.redeemAmount(bump)
                                        .accounts({
                                            redeemDatetime: redeemDatetimeAddress.publicKey,
                                            purchase: purchaseAddress,
                                            brandReceiver: brandATA,
                                            influencerReceiver: influencerATA,
                                            satikReceiver: satikATA,
                                            escrow: escrow,
                                            mint: mint,
                                            tokenProgram: TOKEN_PROGRAM_ID
                                        })
                                        .signers([redeemDatetimeAddress, payer])
                                        .rpc({
                                          skipPreflight:true
                                        })  
                                        

        console.log("Transaction of redeem is: ", tx6);

    });
});
