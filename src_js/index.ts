import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemInstruction,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
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
  SwitchboardWallet,
  TransactionObject,
} from "@switchboard-xyz/solana.js";
import { NodeOracle } from "@switchboard-xyz/oracle";
import {
  OracleJob,
  parseRawMrEnclave,
  parseCronSchedule,
} from "@switchboard-xyz/common";
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
  syncNative,
} from "@solana/spl-token";
import { decimal } from "@solana/buffer-layout-utils";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

let switchboard: SwitchboardProgram;

// const rpcUrl = "http://127.0.0.1:8899";
// const rpcUrl = clusterApiUrl("devnet");
// let connection = new Connection(rpcUrl);

let payerKeypair = SwitchboardTestContext.loadKeypair(
  "/home/viristo/.config/solana/id.json"
);

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Satik as anchor.Program<Satik>;

const mintKeypair = SwitchboardTestContext.loadKeypair("./keypairs/mint.json");
const mintAddress = mintKeypair.publicKey;
// const mintAddress = new PublicKey(
//   "8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy"
// );

const addressLookupProgram = new PublicKey(
  "AddressLookupTab1e1111111111111111111111111"
);

const payerWsolAccount = anchor.utils.token.associatedAddress({
  mint: NATIVE_MINT,
  owner: payerKeypair.publicKey,
});

const influencerKeypair = SwitchboardTestContext.loadKeypair(
  "./keypairs/creator1.json"
);

const sbRequestKeypair = anchor.web3.Keypair.generate();
const sbRoutineKeypair = anchor.web3.Keypair.generate();
const functionAccountKeypair = SwitchboardTestContext.loadKeypair(
  "./keypairs/function1.json"
);
// console.log(functionAccountKeypair.publicKey.toBase58());

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
  "9e6yosfW3c5jJEiDoFyeKoXFeqxcw4YPb635AdywnW7Y"
);

let mrEnclave = parseRawMrEnclave(
  "0x32e433ed9a2669039d0d2e0ac34126e5a3ef07806daaabc1fb41852002108766"
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

const dealId = "deal3";
const [dealPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("deal_seed"),
    Buffer.from(dealId),
    brandPDA.toBytes(),
    influencerPDA.toBytes(),
  ],
  program.programId
);
// console.log(dealPDA.toBase58());

const functionAuthorityName = "PaymentFunction";
const [functionAuthority] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("switchboard_function_authority"),
    Buffer.from(functionAuthorityName),
  ],
  program.programId
);

async function main() {
  switchboard = await SwitchboardProgram.fromProvider(provider);
  // switchboard = await Swi
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
  //   functionAccountKeypair.publicKey,
  //   LAMPORTS_PER_SOL
  // );

  const payerUsdcAddress = await getAssociatedTokenAddress(
    mintAddress,
    payerKeypair.publicKey
  );
  // console.log(payerUsdcAddress.toBase58());

  const influencerUsdcAddress = await getAssociatedTokenAddress(
    mintAddress,
    influencerKeypair.publicKey
  );

  const influencerWsolAta = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    influencerKeypair,
    NATIVE_MINT,
    influencerKeypair.publicKey
  );
  // console.log(influencerWsolAta.address.toBase58());

  const dealUsdcAddress = await getAssociatedTokenAddress(
    mintAddress,
    dealPDA,
    true
  );

  // console.log((await switchboard.attestationProgram).account);
  // await switchboard.verifyNewKeypair(sbRoutineKeypair);

  // const escrowWallet = SwitchboardWallet.fromSeed(
  //   switchboard,
  //   publicAttestationQueuePk,
  //   functionAccountKeypair.publicKey,
  //   functionAccountPk.toBytes()
  // );

  // [functionAccount] = await FunctionAccount.load(
  //   switchboard,
  //   functionAccountPk
  // );
  // [functionRoutineAccount] = await FunctionRoutineAccount.load(
  //   switchboard,
  //   functionRoutineAccountPk
  // );

  // const transaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: payerKeypair.publicKey,
  //     toPubkey: influencerWsolAta.address,
  //     lamports: LAMPORTS_PER_SOL,
  //   })
  // );

  // await sendAndConfirmTransaction(provider.connection, transaction, [
  //   payerKeypair,
  // ]);

  // await syncNative(
  //   provider.connection,
  //   influencerKeypair,
  //   influencerWsolAta.address
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
  //   payerUsdcAddress,
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
  //     mint: mintAddress,
  //     usdcAta: payerUsdcAddress,
  //     signer: payerKeypair.publicKey,
  //   })
  //   .rpc();

  // const fetchedBrand = await program.account.brand.fetch(brandPDA);
  // console.log(fetchedBrand);

  // const tx1 = program.methods
  //   .initializeInfluencer(
  //     influencerUsername,
  //     "Swastima Khadka",
  //     "https://media.themoviedb.org/t/p/w500/pt0Kdyix9VxS9vv1YJzq17jFCQ4.jpg",
  //     "I love influencing people in DARKNESS towards LIGHT",
  //     new BN(10000),
  //     "https://www.instagram.com/swastimakhadka/?hl=en"
  //   )
  //   .accounts({
  //     influencer: influencerPDA,
  //     usdcAta: influencerUsdcAddress,
  //     mint: mintAddress,
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
  //     initialAmount: new BN(10000),
  //     initialAmountOnReach: new BN(500),
  //     startsOn: new BN(Date.now() / 1000),
  //     startsOnReach: new BN(1000),
  //     endsOn: new BN(Date.now() / 1000 + 500000),
  //     endsOnReach: new BN(10000),
  //     cpm: new BN(1000),
  //     // contentUrl: "",
  //     idSeed: dealId,
  //   })
  //   .accounts({
  //     deal: dealPDA,
  //     dealUsdcAta: dealUsdcAddress,
  //     brandUsdcAta: payerUsdcAddress,
  //     brand: brandPDA,
  //     influencer: influencerPDA,
  //     mint: mintAddress,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .rpc();

  // const tx = await program.methods
  //   .acceptDeal("https://mocki.io/v1/09a2f633-42eb-4f4a-b511-d4b37bb99dd7")
  //   .accounts({
  //     influencer: influencerPDA,
  //     deal: dealPDA,
  //     signer: influencerKeypair.publicKey,
  //   })
  //   .signers([influencerKeypair])
  //   .rpc();

  // // console.log(tx);
  // const fetchedDeal = await program.account.deal.fetch(dealPDA);
  // console.log(fetchedDeal);

  // const escrowWallet = SwitchboardWallet.fromSeed(
  //   switchboard,
  //   publicAttestationQueuePk,
  //   functionAuthority,
  //   functionAccountPk
  // );
  // console.log(escrowWallet.publicKey.toBase58());
  // console.log(
  //   anchor.utils.token
  //     .associatedAddress({
  //       mint: NATIVE_MINT,
  //       owner: escrowWallet.publicKey,
  //     })
  //     .toBase58()
  // );

  // const tx = await program.methods
  //   .scheduleFeed()
  //   .accounts({
  //     deal: dealPDA,
  //     switchboardAttestation: switchboard.attestationProgramId,
  //     switchboardAttestationQueue: publicAttestationQueuePk,
  //     switchboardFunction: functionAccountPk,
  //     routine: sbRoutineKeypair.publicKey,
  //     escrowWallet: escrowWallet.publicKey,
  //     escrowTokenWallet: anchor.utils.token.associatedAddress({
  //       mint: NATIVE_MINT,
  //       owner: escrowWallet.publicKey,
  //     }),
  //     switchboardMint: NATIVE_MINT,
  //     functionAuthority: functionAuthority,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .signers([sbRoutineKeypair, payerKeypair])
  //   .rpc();

  // console.log(Buffer.from(parseCronSchedule("* * * 1 * *")));

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

  // let [wallet] = await SwitchboardWallet.create(
  //   switchboard,
  //   publicAttestationQueuePk,
  //   payerKeypair.publicKey,
  //   // functionsOwner,
  //   "SatikWallet",
  //   16,
  // );
  // console.log(wallet.publicKey.toBase58());
  // console.log(functionAuthority.toBase58());

  // const recentSlot = new BN(
  //   await provider.connection.getSlot({
  //     commitment: "finalized",
  //   })
  // );

  // functionAccount = FunctionAccount.fromSeed(
  //   switchboard,
  //   functionAuthority.toBytes(),
  //   recentSlot
  // );

  // const [addressLookupTable] = PublicKey.findProgramAddressSync(
  //   [functionAccount.publicKey.toBuffer(), recentSlot.toBuffer("le", 8)],
  //   addressLookupProgram
  // );

  // const wallet = SwitchboardWallet.fromSeed(
  //   switchboard,
  //   publicAttestationQueuePk,
  //   functionAuthority,
  //   functionAccount.publicKey
  // );

  // const tx = await program.methods
  //   .createSwitchboardFunction(
  //     functionAuthorityName,
  //     "",
  //     "sauravniraula/api_feed",
  //     "dockerhub",
  //     recentSlot,
  //     Array.from(mrEnclave)
  //   )
  //   .accounts({
  //     function: functionAccount.publicKey,
  //     functionAuthority: functionAuthority,
  //     escrowWallet: wallet.publicKey,
  //     escrowTokenWallet: anchor.utils.token.associatedAddress({
  //       mint: NATIVE_MINT,
  //       owner: wallet.publicKey,
  //     }),
  //     mint: NATIVE_MINT,
  //     addressLookupTable: addressLookupTable,
  //     addressLookupProgram,
  //     attestationQueue: publicAttestationQueuePk,
  //     switchboardAttestation: switchboard.attestationProgramId,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .rpc();

  // await FunctionRequestAccount.create(switchboard, {
  //   functionAccount,
  // });

  // await FunctionRoutineAccount.create(switchboard, {
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
