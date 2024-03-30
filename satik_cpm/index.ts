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
} from "@switchboard-xyz/solana.js";
import { NodeOracle } from "@switchboard-xyz/oracle";
import { OracleJob } from "@switchboard-xyz/common";
import { payerKeypair } from "./src_js/constants";
import { base64, bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import * as anchor from "@coral-xyz/anchor";
import { Satik } from "./target/types/satik";
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
const sbRequestKeypair = SwitchboardTestContext.loadKeypair(
  "./keypairs/sb_request.json"
);

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
  "EYSCe3gCvMGnRUjKXHkqmpsShgwGdK4hye87VXu8G13c"
);

let functionRoutineAccount: FunctionRoutineAccount;
let functionRoutineAccountPk = new PublicKey(
  "3GUY3GnJ1hZMJLdt9bZPXcRfhaGST1daTFie3JQK9aFo"
);

let mrEnclave = Uint8Array.from(
  bs58.decode("AroLcpbZ5DJyVboiWYbjyThucig2DpDzBPGn5Xu7QzeG")
);
// console.log(mrEnclave);

const idSeed = Buffer.from("deal1");
const [dealPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("deal_seed"),
    idSeed,
    payerKeypair.publicKey.toBytes(),
    creatorKeypair.publicKey.toBytes(),
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
  //     initialAmount: 1000,
  //     paymentDeals: [
  //       {
  //         startMile: 1000,
  //         endMile: null,
  //         cpm: 10,
  //       },
  //     ],
  //     contentUrl: "https://jsonplaceholder.typicode.com/todos/1",
  //     startsOn: new BN(Date.now() / 1000),
  //     endsOn: null,
  //     creatorPk: creatorKeypair.publicKey,
  //   })
  //   .accounts({
  //     deal: dealPDA,
  //     payer: payerKeypair.publicKey,
  //   })
  //   .rpc();

  // console.log(tx);
  // const fetchedDeal = await program.account.deal.fetch(dealPDA);
  // console.log(fetchedDeal);

  // const tx = await program.methods
  //   .scheduleFeed()
  //   .accounts({
  //     deal: dealPDA,
  //     payer: payerKeypair.publicKey,
  //     switchboardAttestation: switchboard.attestationProgramId,
  //     switchboardAttestationState:
  //       switchboard.attestationProgramState.publicKey,
  //     switchboardAttestationQueue: publicAttestationQueuePk,
  //     switchboardFunction: functionAccountPk,
  //     switchboardRoutine: sbRequestKeypair.publicKey,
  //     switchboardRoutineEscrow: anchor.utils.token.associatedAddress({
  //       mint: switchboard.mint.address,
  //       owner: sbRequestKeypair.publicKey,
  //     }),
  //     switchboardMint: switchboard.mint.address,
  //   })
  //   .signers([sbRequestKeypair])
  //   .rpc();

  // console.log(tx);

  // [functionRoutineAccount] = await FunctionRoutineAccount.create(switchboard, {
  //     schedule: "30 * * * * *",
  //     functionAccount,
  // });

  // [functionAccount] = await FunctionAccount.create(switchboard, {
  //   attestationQueue: publicAttestationQueue,
  //   container: "sauravniraula/api_feed",
  //   containerRegistry: "dockerhub",
  //   name: "API Feed",
  //   mrEnclave,
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
