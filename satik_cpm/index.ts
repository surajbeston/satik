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
} from "@switchboard-xyz/solana.js";
import { NodeOracle } from "@switchboard-xyz/oracle";
import { OracleJob } from "@switchboard-xyz/common";
import { payerKeypair } from "./src_js/constants";
import { base64, bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

let switchboard: SwitchboardProgram;

// const rpcUrl = "http://127.0.0.1:8899";
const rpcUrl = clusterApiUrl("devnet");
let connection = new Connection(rpcUrl);

let publicOracleQueue: QueueAccount;
let publicOracleQueuePk = new PublicKey(
  "uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX"
);
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
  "AZimV4qg2uo9MHhrBqF26DqLau3txRGuXvTVMgwPU7VF"
);

let functionRoutineAccount: FunctionRoutineAccount;
let functionRoutineAccountPk = new PublicKey(
  "3GUY3GnJ1hZMJLdt9bZPXcRfhaGST1daTFie3JQK9aFo"
);

async function main() {
  switchboard = await SwitchboardProgram.load(connection, payerKeypair);
  [publicOracleQueue] = await QueueAccount.load(
    switchboard,
    publicOracleQueuePk
  );
  // [customQueueAccount] = await QueueAccount.load(switchboard, customQueueAccountPk);
  [publicAttestationQueue] = await AttestationQueueAccount.load(
    switchboard,
    publicAttestationQueuePk
  );
  // [customOracleAccount] = await OracleAccount.load(switchboard, customOracleAccountPk);
  // [aggregatorAccount] = await AggregatorAccount.load(switchboard, aggregatorAccountPk);
  [functionAccount] = await FunctionAccount.load(
    switchboard,
    functionAccountPk
  );
  [functionRoutineAccount] = await FunctionRoutineAccount.load(
    switchboard,
    functionRoutineAccountPk
  );

  //   [functionRoutineAccount] = await FunctionRoutineAccount.create(switchboard, {
  //       schedule: "30 * * * * *",
  //       functionAccount,
  //   });

    // functionRoutineAccount.

  // [functionAccount] = await FunctionAccount.create(switchboard, {
  //     attestationQueue: publicAttestationQueue,
  //     container: "sauravniraula/api_feed",
  //     containerRegistry: "dockerhub",
  //     name: "API Feed",
  //     mrEnclave: Uint8Array.from(Array(32).fill(0)),
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
