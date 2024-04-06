import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  SwitchboardProgram,
  QueueAccount,
  OracleAccount,
  JobAccount,
  AggregatorAccount,
  FunctionAccount,
  AttestationQueueAccount,
  FunctionRoutineAccount,
  SwitchboardTestContext,
  FunctionRequestAccount,
} from "@switchboard-xyz/solana.js";
import { NodeOracle } from "@switchboard-xyz/oracle";
import { OracleJob, parseRawMrEnclave } from "@switchboard-xyz/common";
import { payerKeypair } from "../src_js/constants";
import { base64, bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import * as anchor from "@coral-xyz/anchor";
import { Satik } from "../target/types/satik";
import { BN } from "bn.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { decimal } from "@solana/buffer-layout-utils";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

let switchboard: SwitchboardProgram;

// const rpcUrl = "http://127.0.0.1:8899";
// const rpcUrl = clusterApiUrl("devnet");
// let connection = new Connection(rpcUrl);

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Satik as anchor.Program<Satik>;

const mintKeypair = SwitchboardTestContext.loadKeypair("./keypairs/mint.json");

const payerWsolAccount = anchor.utils.token.associatedAddress({
  mint: NATIVE_MINT,
  owner: payerKeypair.publicKey,
});

const influencerKeypair = SwitchboardTestContext.loadKeypair(
  "./keypairs/creator1.json"
);

const sbRequestKeypair = anchor.web3.Keypair.generate();

// let publicOracleQueue: QueueAccount;
// let publicOracleQueuePk = new PublicKey(
//   "uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX"
// );
// let customQueueAccount: QueueAccount;
// let customQueueAccountPk = new PublicKey("6WdSpVz6qFbYqwhQwGyJPQn1JsK5An682F3Ny7jSMkFq");

let publicAttestationQueue: AttestationQueueAccount;
let publicAttestationQueuePk = new PublicKey(
  "CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE"
);

// let customOracleAccount: OracleAccount;
// let customOracleAccountPk = new PublicKey("H9URARvXsN6Yyq8ZRKYXb7QyTUPjA6rpbwYzNRN1As32");

// custom queue aggregator account
// let aggregatorAccount: AggregatorAccount;
// let aggregatorAccountPk = new PublicKey("23EYhjTd6pWC3Jt5jUb8hE5esTv99CXj1LQT5sCcRt9Y");

let functionAccount: FunctionAccount;
let functionAccountPk = new PublicKey(
  "G2ka1S2jqKRWjrn5FUrBf8R566tnghfYfu7ywVEMSAq6"
);

let mrEnclave = parseRawMrEnclave(
  "0x4ad9278e1b0743471da9afe9f56a7ad741feb7e57c0af3a392042998dacb9cbe"
);
// console.log(mrEnclave);
const brandUsername = "brand1";
const [brandPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from(brandUsername)],
  program.programId
);

const influencerUsername = "influencer1";
const [influencerPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from(influencerUsername)],
  program.programId
);

const dealId = "deal2";
const [dealPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("deal_seed"),
    Buffer.from(dealId),
    brandPDA.toBytes(),
    influencerPDA.toBytes(),
  ],
  program.programId
);

async function main() {
  switchboard = await SwitchboardProgram.fromProvider(provider);
  // [publicOracleQueue] = await QueueAccount.load(
  //   switchboard,
  //   publicOracleQueuePk
  // );
  // [customQueueAccount] = await QueueAccount.load(switchboard, customQueueAccountPk);
  [publicAttestationQueue] = await AttestationQueueAccount.load(
    switchboard,
    publicAttestationQueuePk
  );

  // [customOracleAccount] = await OracleAccount.load(switchboard, customOracleAccountPk);
  // [aggregatorAccount] = await AggregatorAccount.load(switchboard, aggregatorAccountPk);

  // await provider.connection.requestAirdrop(
  //   influencerKeypair.publicKey,
  //   LAMPORTS_PER_SOL
  // );

  const payerUsdcAccount = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    payerKeypair,
    mintKeypair.publicKey,
    payerKeypair.publicKey
  );

  const influencerUsdcAccount = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    payerKeypair,
    mintKeypair.publicKey,
    influencerKeypair.publicKey
  );

  const dealUsdcAccount = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    payerKeypair,
    mintKeypair.publicKey,
    dealPDA,
    true
  );

  // [functionAccount] = await FunctionAccount.load(
  //   switchboard,
  //   functionAccountPk
  // );
  // [functionRoutineAccount] = await FunctionRoutineAccount.load(
  //   switchboard,
  //   functionRoutineAccountPk
  // );

  // const mint = await createMint(
  //   provider.connection,
  //   payerKeypair,
  //   payerKeypair.publicKey,
  //   payerKeypair.publicKey,
  //   6,
  //   mintKeypair
  // );
  // console.log(mint.toBase58());

  // await mintTo(
  //   provider.connection,
  //   payerKeypair,
  //   mintKeypair.publicKey,
  //   payerUsdcAccount.address,
  //   payerKeypair,
  //   1000000000
  // );
  // const tx = program.methods
  //   .initializeBrand(
  //     brandUsername,
  //     "Lenovo",
  //     "https://assets.gadgets360cdn.com/pricee/assets/brand/og_lenovo-_logo.png",
  //     "Lenovo is a great brand."
  //   )
  //   .accounts({
  //     brand: brandPDA,
  //     mint: mintKeypair.publicKey,
  //     usdcAta: payerUsdcAccount.address,
  //     signer: payerKeypair.publicKey,
  //   })
  //   .signers([payerKeypair])
  //   .rpc();

  // const fetchedBrand = await program.account.brand.fetch(brandPDA);
  // console.log(fetchedBrand);

  // const tx1 = program.methods
  //   .initializeInfluencer(
  //     influencerUsername,
  //     "Swastima Khadka",
  //     "https://media.themoviedb.org/t/p/w500/pt0Kdyix9VxS9vv1YJzq17jFCQ4.jpg",
  //     "I love influencing people in DARKNESS towards LIGHT"
  //   )
  //   .accounts({
  //     influencer: influencerPDA,
  //     usdcAta: influencerUsdcAccount.address,
  //     mint: mintKeypair.publicKey,
  //     signer: influencerKeypair.publicKey,
  //   })
  //   .signers([influencerKeypair])
  //   .rpc();

  // const fetchedInfluencer = await program.account.influencer.fetch(
  //   influencerPDA
  // );
  // console.log(fetchedInfluencer);

  // const tx = await program.methods
  //   .createDeal({
  //     initialAmount: new BN(100000),
  //     initialAmountOnReach: new BN(500),
  //     startsOn: new BN(Date.now() / 1000),
  //     startsOnReach: new BN(1000),
  //     endsOn: new BN(Date.now() / 1000 + 1000000),
  //     endsOnReach: new BN(10000),
  //     cpm: new BN(1000),
  //     // contentUrl: "",
  //     idSeed: dealId,
  //   })
  //   .accounts({
  //     deal: dealPDA,
  //     dealUsdcAta: dealUsdcAccount.address,
  //     brandUsdcAta: payerUsdcAccount.address,
  //     brand: brandPDA,
  //     influencer: influencerPDA,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .signers([payerKeypair])
  //   .rpc();

  // const tx = await program.methods
  //   .acceptDeal("https://eoo6aio1mbtg4nl.m.pipedream.net")
  //   .accounts({
  //     influencer: influencerPDA,
  //     deal: dealPDA,
  //     signer: influencerKeypair.publicKey,
  //   })
  //   .signers([influencerKeypair])
  //   .rpc();

  // // console.log(tx);
  const fetchedDeal = await program.account.deal.fetch(dealPDA);
  console.log(fetchedDeal);

  // const tx = await program.methods
  //   .scheduleFeed()
  //   .accounts({
  //     deal: dealPDA,
  //     switchboardAttestation: switchboard.attestationProgramId,
  //     switchboardAttestationState:
  //       switchboard.attestationProgramState.publicKey,
  //     switchboardAttestationQueue: publicAttestationQueuePk,
  //     switchboardFunction: functionAccountPk,
  //     switchboardRequest: sbRequestKeypair.publicKey,
  //     switchboardRequestEscrow: anchor.utils.token.associatedAddress({
  //       mint: NATIVE_MINT,
  //       owner: sbRequestKeypair.publicKey,
  //     }),
  //     switchboardMint: switchboard.mint.address,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .signers([sbRequestKeypair, payerKeypair])
  //   .rpc();

  // const tx = await program.methods
  //   .scheduledFeedCallback({
  //     reach: new BN(1200),
  //   })
  //   .accounts({
  //     deal: dealPDA,
  //     dealUsdcAta: dealUsdcAccount.address,
  //     influencerUsdcAta: influencerUsdcAccount.address,
  //     enclaveSigner: payerKeypair.publicKey,
  //   })
  //   .signers([payerKeypair])
  //   .rpc();

  // console.log(tx);

  // [functionAccount] = await FunctionAccount.create(switchboard, {
  //   attestationQueue: publicAttestationQueue,
  //   container: "sauravniraula/api_feed",
  //   containerRegistry: "dockerhub",
  //   name: "API Feed 11",
  //   mrEnclave,
  // });
  // console.log(functionAccount.publicKey.toBase58());

  // [functionRequestAccount] = await FunctionRequestAccount.create(switchboard, {
  //   functionAccount,
  // });

  // [functionRoutineAccount] = await FunctionRoutineAccount.create(switchboard, {
  //   schedule: "* 1 * * * *",
  //   functionAccount,
  // });

  // console.log(functionAccount.publicKey.toBase58());
  // console.log(functionRoutineAccount.publicKey.toBase58());

  //   console.log((await functionAccount.loadData()).toJSON());

  // console.log(await aggregatorAccount.openRound());
  // console.log((await aggregatorAccount.loadData()).toJSON());
  // console.log(await aggregatorAccount.fetchLatestValue());
  // console.log((await aggregatorAccount.loadData()).toJSON());

  // console.log(aggregatorAccount.publicKey.toBase58());
  // console.log(aggregatorAccount.publicKey.toString());
}

main();
