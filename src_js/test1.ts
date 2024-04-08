import fs from "node:fs"

import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AggregatorAccount, OracleAccount, QueueAccount, SwitchboardProgram } from "@switchboard-xyz/solana.js";
import { OracleJob } from "@switchboard-xyz/common";
// import { payerKeypair } from "./constants";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";


const connection = new Connection(clusterApiUrl("devnet"))

async function main() {
    let program: SwitchboardProgram = await SwitchboardProgram.load(
        connection,
        // payerKeypair,
    )

    const queueAccount = new QueueAccount(
        program,
        new PublicKey("uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX"),
    )

    // const [aggregatorAccount] = await queueAccount.createFeed({
    //     batchSize: 1,
    //     minRequiredOracleResults: 1,
    //     minRequiredJobResults: 1,
    //     minUpdateDelaySeconds: 60,
    //     fundAmount: 0.0001,
    //     jobs: [
    //         {
    //             weight: 2,
    //             data: OracleJob.encodeDelimited(
    //                 OracleJob.fromObject({
    //                     tasks: [
    //                         {
    //                             valueTask: {
    //                                 value: 1,
    //                             },
    //                         },
    //                     ],
    //                 })
    //             ).finish(),
    //         },
    //     ],
    // })
    const aggregatorAccount = new AggregatorAccount(
        program,
        new PublicKey("Eyd3wzFrPUpTpZEQhHWLZ94e7bSprnhVdqZbFWpwEbF2"),
    )
    console.log(await aggregatorAccount.fetchLatestValue());






    // const solUSD = "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
    // const aggregatorAccount = new AggregatorAccount({
    //     program,
    //     publicKey: new PublicKey(solUSD),
    // })

}

main()