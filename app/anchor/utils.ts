import {
    getAssociatedTokenAddress,
    createMint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAccount,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    createAssociatedTokenAccount,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError,
    transfer
} from '@solana/spl-token';
import * as anchor from "@coral-xyz/anchor";

import initWorkspace from "./useWorkspace";

import { Keypair, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";


import { useAnchorWallet, AnchorWallet, useWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl, PublicKey, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";



type returnType = { wallet: AnchorWallet, connection: Connection, provider: AnchorProvider, program: ComputedRef<Program> };

import { Buffer } from 'buffer'
import { ComputedRef } from 'vue';

const mintAddress = new PublicKey("4ad9Yfhad6dwF7sqgh59uMsXTUXEeRNe7HgqFM9i4Yte");

const { wallet, connection, provider, program }: returnType = initWorkspace();



export async function createInfluencerAccount(username: String, name: String, profile_image: String, bio: String) {
    const [influencerAddress, bump] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(username)], program.value.programId);
    const { publicKey } = useWallet();
    const influencerATA = await getAssociatedTokenAddress(mintAddress, publicKey.value);

    const tx = await program.value.methods.initializeInfluencer(username, name, profile_image, bio)
        .accounts({
            usdcAta: influencerATA,
            influencer: influencerAddress,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            mint: mintAddress,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
    console.log(tx);

}

export async function fetchAllInfluencers() {
    const influencers = await program.value.account.influencer.all();
    return influencers;
}

export async function fetchInfluencerByUsername(username: string) {
    const  influencers = await fetchAllInfluencers();
    for (var influencer of influencers){   
        console.log(influencer)     
        if (influencer.account.username == username) return influencer;
    }   
}

