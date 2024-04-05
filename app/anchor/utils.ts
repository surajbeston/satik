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
  NATIVE_MINT,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

import initWorkspace from "./useWorkspace";

import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

import { SwitchboardProgram } from "@switchboard-xyz/solana.js";

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
import { BN } from "bn.js";
import { CreateCPMContractParams } from "../src/types";

const mintAddress = new PublicKey(
  "8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy"
);
let publicAttestationQueuePk = new PublicKey(
  "CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE"
);
let functionAccountPk = new PublicKey(
  "G2ka1S2jqKRWjrn5FUrBf8R566tnghfYfu7ywVEMSAq6"
);

const { wallet, connection, provider, program }: returnType = initWorkspace();

console.log("rent", anchor.web3.SYSVAR_RENT_PUBKEY.toBase58());

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
    publicKey.value!
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

export async function createBrandAccount(
  username: String,
  name: String,
  profile_image: String,
  bio: String
) {
  const [brandAddress, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(username)],
    program.value.programId
  );
  const { publicKey } = useWallet();
  const brandATA = await getAssociatedTokenAddress(
    mintAddress,
    publicKey.value!
  );

  const tx = await program.value.methods
    .initializeBrand(username, name, profile_image, bio)
    .accounts({
      usdcAta: brandATA,
      brand: brandAddress,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      mint: mintAddress,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc({
      skipPreflight: true,
    });
  console.log(tx);
}

export async function initializeProposal(
  message: String,
  influencerAddress: PublicKey,
  brandAddress: PublicKey
) {
  const proposal = new anchor.web3.Keypair();
  const { publicKey } = useWallet();

  const tx = await program.value.methods
    .initializeProposal(message, publicKey.value)
    .accounts({
      proposal: proposal.publicKey,
      brand: brandAddress,
      influencer: influencerAddress,
    })
    .signers([proposal])
    .rpc();
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
    
    const finalTx = await provider.value.wallet.signAllTransactions(tx, connection);
    
    console.log(finalTx);
}

export async function acceptProposal(proposalAddresString: string) {
  const proposal = new PublicKey(proposalAddresString);
  const tx = await program.value.methods
    .acceptProposal()
    .accounts({
      proposal: proposal,
    })
    .rpc();
  console.log(tx);
}

export async function initializeProduct(
  name: String,
  description: String,
  totalAmount: number,
  influencerAmount: number,
  proposalAddress: PublicKey
) {
  const product = Keypair.generate();

  const tx = await program.value.methods
    .initializeProduct(
      name,
      description,
      totalAmount * 10 ** 6,
      influencerAmount * 10 ** 6
    )
    .accounts({
      product: product.publicKey,
      proposal: proposalAddress,
    })
    .signers([product])
    .rpc();
  return product.publicKey;
}

export async function createCPMContract(
  influencerPk: PublicKey,
  brandPk: PublicKey,
  params: CreateCPMContractParams
) {
  const { publicKey } = useWallet();
  const [dealPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("deal_seed"),
      Buffer.from(params.uniqueId),
      brandPk.toBytes(),
      influencerPk.toBytes(),
    ],
    program.value.programId
  );

  const dealUsdcAta = await getAssociatedTokenAddress(
    mintAddress,
    dealPDA,
    true
  );
  const brandATA = await getAssociatedTokenAddress(
    mintAddress,
    publicKey.value!
  );

  let perReachAmount = params.cpm * 1000;

  let data: any = {};
  if (params.initialAmount) {
    data.initialAmount = new BN(params.initialAmount);
  }
  data = {
    ...data,
    idSeed: params.uniqueId,
    initialAmountOnReach: params.initialAmountOnReach,
    startsOn: new BN(params.startsOn.getUTCSeconds()),
    startsOnReach: new BN(params.startsOnReach),
    endsOn: new BN(params.endsOn.getUTCSeconds()),
    endsOnReach: new BN(params.endsOnReach),
    cpm: new BN(perReachAmount),
  };

  const tx = await program.value.methods
    .createDeal(data)
    .accounts({
      deal: dealPDA,
      dealUsdcAta: dealUsdcAta,
      brandUsdcAta: brandATA,
      brand: brandPk,
      influencer: influencerPk,
      payer: publicKey.value!,
    })
    .rpc();
  console.log("Deal created !");
}

export async function acceptCPMContract(
  influencerPk: PublicKey,
  dealPk: PublicKey,
  contentUrl: String
) {
  const { publicKey } = useWallet();

  const tx = await program.value.methods
    .acceptDeal(contentUrl)
    .accounts({
      influencer: influencerPk,
      deal: dealPk,
      signer: publicKey.value!,
    })
    .rpc();

  console.log("Deal accepted !");
}

export async function scheduleCPMFeed(dealPk: PublicKey) {
  let wallet = useWallet();
  let switchboard = await SwitchboardProgram.load(connection);

  let sbRequestKeypair = anchor.web3.Keypair.generate();

  const tx = await program.value.methods
    .scheduleFeed()
    .accounts({
      deal: dealPk,
      switchboardAttestation: switchboard.attestationProgramId,
      switchboardAttestationState:
        switchboard.attestationProgramState.publicKey,
      switchboardAttestationQueue: publicAttestationQueuePk,
      switchboardFunction: functionAccountPk,
      switchboardRequest: sbRequestKeypair.publicKey,
      switchboardRequestEscrow: anchor.utils.token.associatedAddress({
        mint: NATIVE_MINT,
        owner: sbRequestKeypair.publicKey,
      }),
      switchboardMint: switchboard.mint.address,
      payer: wallet.publicKey.value!,
    })
    .signers([sbRequestKeypair])
    .rpc();

  console.log("CPM Feed Scheduled !");
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
  const { publicKey } = useWallet();

  // console.log(publicKey.value.toBase58())
  console.log("inside curent user", publicKey.value);

  // console.log(publicKey.value.toBase58())

  for (var influencer of influencers) {
    if (influencer.account.createdBy.toBase58() == publicKey.value.toBase58()) {
      return ["Influencer", influencer];
    }
  }

  const brands = await fetchAllBrands();

  console.log(brands);

  for (var brand of brands) {
    if (brand.account.createdBy.toBase58() == publicKey.value.toBase58()) {
      return ["Brand", brand];
    }
  }

  console.log("fuiya...");
}

export async function getInfluencerProposals(influencerAddressString: String) {
  const allProposals = await program.value.account.proposal.all();
  const influencerProposals = [];
  console.log(influencerAddressString);
  for (var proposal of allProposals) {
    console.log("This is proposal", proposal);
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
    console.log("This is product", product);
    if (product.account.proposal.toBase58() == proposalAddressString) {
      proposalProducts.push(product);
    }
  }
  return proposalProducts;
}

export async function acceptInfluencerProposal(proposal: PublicKey) {
  await program.value.methods
    .acceptProposal()
    .accounts({
      proposal: proposal,
    })
    .rpc();
}
