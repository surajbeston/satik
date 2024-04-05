import BN from "bn.js";
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
  transfer,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

import initWorkspace from "./useWorkspace";

import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

import { useAnchorWallet, AnchorWallet, useWallet } from "solana-wallets-vue";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";

type returnType = {
  wallet: AnchorWallet;
  connection: Connection;
  provider: AnchorProvider;
  program: ComputedRef<Program>;
};

import { Buffer } from "buffer";
import { ComputedRef } from "vue";

const mintAddress = new PublicKey(
  "8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy"
);

const { wallet, connection, provider, program }: returnType = initWorkspace();

console.log("rent", anchor.web3.SYSVAR_RENT_PUBKEY.toBase58())

export async function createInfluencerAccount(
  username: String,
  name: String,
  profile_image: String,
  bio: String
) {
  const [influencerAddress, bump] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(username)],
      program.value.programId
    );
  const { publicKey } = useWallet();
  const influencerATA = await getAssociatedTokenAddress(
    mintAddress,
    publicKey.value
  );

  const tx = await program.value.methods
    .initializeInfluencer(username, name, profile_image, bio)
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



export async function createBrandAccount(username: String, name: String, profile_image: String, bio: String) {
    const [brandAddress, bump] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(username)], program.value.programId);
    const { publicKey } = useWallet();
    const brandATA = await getAssociatedTokenAddress(mintAddress, publicKey.value);

    const tx = await program.value.methods.initializeBrand(username, name, profile_image, bio)
        .accounts({
            usdcAta: brandATA,
            brand: brandAddress,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            mint: mintAddress,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc({
          skipPreflight: true
        });
    console.log(tx);
}

export async function initializeProposal(message: String, influencerAddress: PublicKey, brandAddress: PublicKey) {
    const proposal = new anchor.web3.Keypair();
    const {publicKey} = useWallet();

    const tx = await program.value.methods.initializeProposal(message, publicKey.value)
                                .accounts({
                                    proposal: proposal.publicKey,
                                    brand: brandAddress,
                                    influencer: influencerAddress
                                })
                                .signers([proposal])
                                .rpc()
    return proposal.publicKey;
}

export async function initializeProposalWithProducts(message: String, influencerAddress: PublicKey, brandAddress: PublicKey, products: any[]){
  const proposal = new anchor.web3.Keypair();
    const {publicKey, wallet} = useWallet();

    // const productInstructions = products.map((product: any) => program.value.methods.initializeProduct(product.productName, product.productDescription, product.totalAmount * 10 ** 6, product.influencerAmount * 10 ** 6)
    //                                       .accounts({
    //                                         product: product.publicKey,
    //                                         proposal: proposal.publicKey
    //                                       })
    //                                       .signers([product]))

    // console.log(productInstructions);



    const tx = new Transaction();

    const proposalTransaction = await program.value.methods.initializeProposal(message, publicKey.value)
                                .accounts({
                                    proposal: proposal.publicKey,
                                    brand: brandAddress,
                                    influencer: influencerAddress
                                })
                                .signers([proposal])
                                .instruction();
    tx.add(proposalTransaction);
                                
    for (var product of products) {
      console.log("product", product);
      const productTransaction = await program.value.methods.initializeProduct(product.productName, product.productDescription, new  BN(product.totalAmount * 10 ** 6), new BN(product.influencerAmount * 10 ** 6))
                                          .accounts({
                                            product: product.publicKey,
                                            proposal: proposal.publicKey
                                          })
                                          .signers([product])
                                          .instruction()
      tx.add(productTransaction);
    }
    
    const finalTx = await wallet.value.adapter.sendTransaction(tx, connection);
    
    console.log(finalTx);
}

export async function acceptProposal(proposalAddresString: string) {
    const proposal = new PublicKey(proposalAddresString);
    const tx =  await program.value.methods.acceptProposal()
                      .accounts({
                        proposal: proposal
                      })
                      .rpc()
    console.log(tx)
}

export async function initializeProduct(name: String, description: String, totalAmount: number, influencerAmount: number, proposalAddress: PublicKey) {
    const product = Keypair.generate();

    const tx = await program.value.methods.initializeProduct(name, description, totalAmount * 10 ** 6, influencerAmount * 10 ** 6)
                                          .accounts({
                                            product: product.publicKey,
                                            proposal: proposalAddress
                                          })
                                          .signers([product])
                                          .rpc()
    return product.publicKey;
}

export async function fetchAllInfluencers() {
  const influencers = await program.value.account.influencer.all();
  return influencers;
}
export async function fetchAllBrands() {
  const brands = await program.value.account.brand.all();
  return brands;
}

export async function fetchBrandByUsername(username: string) {
  const brands = await fetchAllBrands();

  for (var brand of brands) {
    if (brand.account.username == username) return brand;
  }
}

export async function fetchInfluencerByUsername(username: string) {
  const influencers = await fetchAllInfluencers();
  console.log(influencers);
  for (var influencer of influencers) {
    console.log(influencer);
    if (influencer.account.username == username) return influencer;
  }
}


export async function getCurrentUser() {
  const influencers = await fetchAllInfluencers();
    const {publicKey } = useWallet();

    console.log("inside curent user", publicKey.value)

    // console.log(publicKey.value.toBase58())

    for (var influencer of influencers) {
      if (influencer.account.createdBy.toBase58() == publicKey.value.toBase58()) {
        return ["Influencer", influencer];
      }
    }

    const brands = await fetchAllBrands();

    console.log(brands);

    for (var brand of brands) {
      if(brand.account.createdBy.toBase58() == publicKey.value.toBase58()) {
        return ["Brand", brand];
      }
    }

    console.log("fuiya...")
}

export async function getInfluencerProposals(influencerAddressString: String) {
  const allProposals = await program.value.account.proposal.all();
  const influencerProposals = [];
  console.log(influencerAddressString);
  for (var proposal of allProposals) {
    console.log("This is proposal", proposal)
    console.log(proposal.account.influencerKey.toBase58());
    if (proposal.account.influencerKey.toBase58() == influencerAddressString) {
      influencerProposals.push(proposal);
    }
  }
  console.log("influencer proposals", influencerProposals);
  for (var proposal of influencerProposals) {
    var brand = await program.value.account.brand.fetch(proposal.account.brand);
    proposal.account.brand = brand;
  }

  return influencerProposals;
}

export async function getProposalProducts(proposalAddressString: String) {
  const allProducts = await program.value.account.product.all();
  const proposalProducts = [];
  console.log(proposalAddressString);
  for (var product of allProducts) {
    console.log("This is product", product)
    if (product.account.proposal.toBase58() == proposalAddressString) {
      proposalProducts.push(product);
    }
  }
  return proposalProducts;
}

export async function acceptInfluencerProposal(proposal: PublicKey) {
  await program.value.methods.acceptProposal()
                              .accounts({
                                proposal: proposal
                              })
                              .rpc()
}