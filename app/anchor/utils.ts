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

import { Batch } from "../target/types/batch";

import initWorkspace from "./useWorkspace";

import {
  Keypair,
} from "@solana/web3.js";


import { parseRawMrEnclave } from "@switchboard-xyz/common";

import {  AnchorWallet, useWallet } from "solana-wallets-vue";
import {
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

import { Buffer } from "buffer";
import { ComputedRef } from "vue";
import { BN } from "bn.js";
import { CreateCPMContractParams } from "../src/types";

const mintAddress = new PublicKey(
  "8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy"
);

const { wallet, program }: returnType = initWorkspace();


type returnType = {
  wallet: ComputedRef<AnchorWallet>;
  connection: ComputedRef<Connection>;
  provider: ComputedRef<AnchorProvider>;
  program: ComputedRef<Program>;
};

export async function createInfluencerAccount(
  username: String,
  name: String,
  profile_image: String,
  bio: String,
  total_followers: number,
  social_media: String
) {
  console.log("reached here");
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
    .initializeInfluencer(
      username,
      name,
      profile_image,
      bio,
      new BN(total_followers),
      social_media
    )
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

export async function initializeProposalWithProducts(
  message: String,
  influencerAddress: PublicKey,
  brandAddress: PublicKey,
  products: any[],
  redeemerURL: String
) {
  const proposal = new anchor.web3.Keypair();
  const { publicKey } = useWallet();

  const instructions = [];
  const instructionSigners = [];
  for (var product of products) {
    const productAddress = new anchor.web3.Keypair();
    instructions.push(
      await program.value.methods
        .initializeProduct(
          product.productName,
          product.productDescription,
          new BN(product.totalAmount * 10 ** 6),
          new BN(product.influencerAmount * 10 ** 6)
        )
        .accounts({
          product: productAddress.publicKey,
          proposal: proposal.publicKey,
        })
        .instruction()
    );
    instructionSigners.push(productAddress);
    product.productAddress = productAddress.publicKey.toBase58();
  }

  const proposalTransaction = await program.value.methods
    .initializeProposal(message, publicKey.value, redeemerURL)
    .accounts({
      proposal: proposal.publicKey,
      brand: brandAddress,
      influencer: influencerAddress,
    })
    .postInstructions(instructions)
    .signers([proposal, ...instructionSigners])
    .rpc();

  console.log(proposalTransaction);

  return [products, proposal.publicKey.toBase58()];
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

export async function addProposalWebpage(
  proposalAddressString: String,
  webpage: String
) {
  const proposalAddress = new PublicKey(proposalAddressString);

  var proposalFetched =
    await program.value.account.proposal.fetch(proposalAddress);
  console.log("Fetched Proposal old", proposalFetched);

  const tx = await program.value.methods
    .addProposalWebpage(webpage)
    .accounts({
      proposal: proposalAddress,
    })
    .rpc();
  console.log(tx);
  proposalFetched = await program.value.account.proposal.fetch(proposalAddress);
  console.log("Fetched Proposal", proposalFetched);
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

  let data: any = {};
  let perReachAmount = params.cpm * 1000;

  data.initialAmount = params.initialAmount
    ? new BN(params.initialAmount)
    : null;
  data.initialAmountOnReach = params.initialAmountOnReach
    ? new BN(params.initialAmountOnReach)
    : null;

  data = {
    ...data,
    idSeed: params.uniqueId,
    startsOn: new BN(params.startsOn.getTime() / 1000),
    startsOnReach: new BN(params.startsOnReach),
    endsOn: new BN(Math.trunc(params.endsOn.getTime() / 1000)),
    endsOnReach: new BN(params.endsOnReach),
    cpm: new BN(perReachAmount),
  };

  let accounts = {
    deal: dealPDA,
    dealUsdcAta: dealUsdcAta,
    brandUsdcAta: brandATA,
    brand: brandPk,
    influencer: influencerPk,
    payer: publicKey.value!,
    mint: mintAddress,
  };

  const tx = await program.value.methods
    .createDeal(data)
    .accounts(accounts)
    .rpc();
  console.log(tx);

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
      influencer: new PublicKey(influencerPk),
      deal: dealPk,
      signer: publicKey.value!,
    })
    .rpc();

  console.log("Deal accepted !");
}

export async function scheduleCPMFeed(dealPk: PublicKey) {
  let switchboard = await SwitchboardProgram.fromProvider(provider.value);

  // Function authority is PDA that has authority over all
  // function account created via create_switchboard_function program's method

  const functionAuthorityName = "PaymentFunction";
  const [functionAuthority] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("switchboard_function_authority"),
      Buffer.from(functionAuthorityName),
    ],
    program.value.programId
  );

  // Function account Pk, Escrow wallet and Escrow wallet token
  // are created by calling create_switchboard_function

  let functionAccount = new PublicKey(
    "9e6yosfW3c5jJEiDoFyeKoXFeqxcw4YPb635AdywnW7Y"
  );
  let escrowWallet = new PublicKey(
    "4hM78xSxQBe139S2F3XqbkAzovynYW3TkWKzrLiVCJcy"
  );

  let sbRoutineKeypair = anchor.web3.Keypair.generate();

  const tx = await program.value.methods
    .scheduleFeed()
    .accounts({
      deal: dealPk,
      switchboardAttestation: switchboard.attestationProgramId,
      switchboardAttestationQueue: publicAttestationQueuePk,
      switchboardFunction: functionAccount,
      routine: sbRoutineKeypair.publicKey,
      escrowWallet: escrowWallet,
      escrowTokenWallet: anchor.utils.token.associatedAddress({
        mint: NATIVE_MINT,
        owner: escrowWallet,
      }),
      switchboardMint: NATIVE_MINT,
      functionAuthority: functionAuthority,
      payer: wallet.value.publicKey,
    })
    .signers([sbRoutineKeypair])
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

  for (var influencer of influencers) {
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

  for (var brand of brands) {
    if (brand.account.createdBy.toBase58() == publicKey.value.toBase58()) {
      return ["Brand", brand];
    }
  }
}
export async function getBrandProposals(brandAddressString: String) {
  const allProposals = await program.value.account.proposal.all();
  const brandProposals = [];

  for (var proposal of allProposals) {
    if (proposal.account.createdBy.toBase58() === brandAddressString) {
      brandProposals.push(proposal);
    }
  }

  const influencers = await fetchAllInfluencers();

  for (var proposal of brandProposals) {
    const proposalInfluencerKey = proposal.account.influencerKey.toBase58();
    for (var influencer of influencers) {
      const influencerKey = influencer.account.createdBy.toBase58();

      if (proposalInfluencerKey === influencerKey) {
        proposal.account.influencer = influencer.account;
      }
    }
  }
  return brandProposals;
}

export async function getInfluencerProposals(influencerAddressString: String) {
  const allProposals = await program.value.account.proposal.all();
  const influencerProposals = [];

  for (var proposal of allProposals) {
    if (proposal.account.influencerKey.toBase58() == influencerAddressString) {
      influencerProposals.push(proposal);
    }
  }

  for (var proposal of influencerProposals) {
    var brand = await program.value.account.brand.fetch(proposal.account.brand);
    proposal.account.brand = brand;
  }

  return influencerProposals;
}

export async function getBrandCPMContracts(address) {
  let allCPMContracts = await program.value.account.deal.all();
  allCPMContracts = allCPMContracts.filter((e) => {
    return e.account.brand.toBase58() == address;
  });
  for (var deal of allCPMContracts) {
    var influencer = await program.value.account.influencer.fetch(
      deal.account.influencer
    );
    deal.account.influencer = influencer;
  }
  return allCPMContracts;
}

export async function getInfluencerCPMContracts(address) {
  let allCPMContracts = await program.value.account.deal.all();
  allCPMContracts = allCPMContracts.filter((e) => {
    return e.account.influencer.toBase58() == address;
  });
  for (var deal of allCPMContracts) {
    var brand = await program.value.account.brand.fetch(deal.account.brand);
    deal.account.brand = brand;
  }
  return allCPMContracts;
}

export async function getProposalProducts(proposalAddressString: String) {
  const allProducts = await program.value.account.product.all();
  const proposalProducts = [];
  for (var product of allProducts) {
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
