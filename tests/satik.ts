import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Satik } from "../target/types/satik";
import { PublicKey } from "@solana/web3.js";
import { u32, u8, struct, blob, Layout } from "@solana/buffer-layout";
import { publicKey, u64, bool } from "@solana/buffer-layout-utils";

import { BN } from 'bn.js';
import { assert } from "chai";


describe("satik", () => {

    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.Satik as Program<Satik>;

    it("Initialize brand and influencer, create proposal and accept it", async () => {

        const BRAND_USERNAME = (Math.random() + 1).toString(36).substring(7);
        const [brandAddress] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(BRAND_USERNAME)], program.programId);

        console.log("Address of brand is: ", brandAddress.toBase58());

        const INFLUENCER_USERNAME = (Math.random() + 1).toString(36).substring(7);
        const [influencerAddress] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(INFLUENCER_USERNAME)], program.programId);

        const tx = await program.methods.initializeBrand( BRAND_USERNAME,  'Not Brand', 'https://image.com/image.jpeg', "This my brand bio.")
                                        .accounts({
                                            brand: brandAddress
                                        })
                                        .rpc()
        console.log("This is the transaction of brand: ", tx)
        
        const brand = await program.account.brand.fetch(brandAddress);

        assert(brand.username, BRAND_USERNAME);

        const tx1 = await program.methods
                                .initializeInfluencer(INFLUENCER_USERNAME,'Not Influencer', 'https://image.com/image.image', "I'm not a real influencer -)")
                                .accounts({
                                    influencer: influencerAddress
                                })
                                .rpc();
        console.log("This is the transaction of influencer: ", tx1);

        const influencer = await program.account.influencer.fetch(influencerAddress);
        assert(influencer, INFLUENCER_USERNAME);


        const proposalKeyPair = anchor.web3.Keypair.generate();
        const tx2 = await program.methods.initializeProposal("website", "message")
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
        
        const products = [{"name": "Suraj Jha", "description": "This is suraj", "total_amount": 1000, "influencer_amount": 500}]

        for(var product of products) {
            const productKeyPair = anchor.web3.Keypair.generate();
            const tx3 = await program.methods.initializeProduct("product 1", "description", new BN(123), new BN(23))
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

    });
});
