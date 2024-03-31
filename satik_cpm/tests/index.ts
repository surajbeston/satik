import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
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

let switchboard: SwitchboardProgram;

// const rpcUrl = "http://127.0.0.1:8899";
// const rpcUrl = clusterApiUrl("devnet");
// let connection = new Connection(rpcUrl);

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Satik as anchor.Program<Satik>;

const creatorKeypair = SwitchboardTestContext.loadKeypair(
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
  "9pN85zT2N8KV9GfdCTPydBaMZGYxR55WdcwSqSzB8eU4"
);

let functionRequestAccount: FunctionRequestAccount;
let functionRequestAccountPk: PublicKey;

let functionRoutineAccount: FunctionRoutineAccount;
// let functionRoutineAccountPk = new PublicKey(
//   "3GUY3GnJ1hZMJLdt9bZPXcRfhaGST1daTFie3JQK9aFo"
// );

let mrEnclave = parseRawMrEnclave(
  "0xb1c40cc13d9108ab3aecef6cb722c6d039fc65031a728c904582764016bdc7c7"
);
// console.log(mrEnclave);

const idSeed = Buffer.from("deal2");
const [dealPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("deal_seed"),
    idSeed,
    payerKeypair.publicKey.toBytes(),
    creatorKeypair.publicKey.toBytes(),
  ],
  program.programId
);

const [userPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("user_pda_seed"), payerKeypair.publicKey.toBytes()],
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
  // [functionAccount] = await FunctionAccount.load(
  //   switchboard,
  //   functionAccountPk
  // );
  // [functionRoutineAccount] = await FunctionRoutineAccount.load(
  //   switchboard,
  //   functionRoutineAccountPk
  // );

  // const tx = await program.methods
  //   .createDeal({
  //     idSeed,
  //     initialAmount: new BN(1000),
  //     paymentDeals: [
  //       {
  //         startMile: 1000,
  //         endMile: null,
  //         cpm: 10,
  //       },
  //     ],
  //     contentUrl: "https://eoo6aio1mbtg4nl.m.pipedream.net",
  //     startsOn: new BN(Date.now() / 1000),
  //     endsOn: null,
  //     creatorPk: creatorKeypair.publicKey,
  //   })
  //   .accounts({
  //     deal: dealPDA,
  //     payingAccount: userPDA,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .rpc();

  // console.log(tx);
  // const fetchedDeal = await program.account.deal.fetch(dealPDA);
  // console.log(fetchedDeal);

  const tx = await program.methods
    .scheduleFeed()
    .accounts({
      payer: payerKeypair.publicKey,
      payingAccount: userPDA,
      deal: dealPDA,
      switchboardAttestation: switchboard.attestationProgramId,
      switchboardAttestationState:
        switchboard.attestationProgramState.publicKey,
      switchboardAttestationQueue: publicAttestationQueuePk,
      switchboardFunction: functionAccountPk,
      switchboardRequest: sbRequestKeypair.publicKey,
      switchboardRequestEscrow: anchor.utils.token.associatedAddress({
        mint: switchboard.mint.address,
        owner: sbRequestKeypair.publicKey,
      }),
      switchboardMint: switchboard.mint.address,
    })
    .signers([sbRequestKeypair])
    .rpc();

  console.log(tx);

  // [functionAccount] = await FunctionAccount.create(switchboard, {
  //   attestationQueue: publicAttestationQueue,
  //   container: "sauravniraula/api_feed",
  //   containerRegistry: "dockerhub",
  //   name: "API Feed 10",
  //   mrEnclave,
  // });

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
