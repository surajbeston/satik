import {
  AggregatorAccount,
  SwitchboardTestContext,
} from "@switchboard-xyz/solana.js";
import * as anchor from "@coral-xyz/anchor";
import { NodeOracle } from "@switchboard-xyz/oracle";
import { OracleJob } from "@switchboard-xyz/common";
import { assert } from "chai";

describe("anchor-feed-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  let switchboard: SwitchboardTestContext;
  let oracle: NodeOracle;

  let aggregatorAccount: AggregatorAccount;

  before(async () => {
    console.log("Loading switchboard");

    switchboard = await SwitchboardTestContext.loadFromProvider(provider, {
      name: "Test Queue",
      // You can provide a keypair to so the PDA schemes dont change between test runs
      keypair: SwitchboardTestContext.loadKeypair("../keypairs/queue.json"),
      queueSize: 10,
      reward: 0,
      minStake: 0,
      oracleTimeout: 900,
      // aggregators will not require PERMIT_ORACLE_QUEUE_USAGE before joining a queue
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: true,
      oracle: {
        name: "Test Oracle",
        enable: true,
        stakingWalletKeypair: SwitchboardTestContext.loadKeypair(
          "../keypairs/oracle1.json"
        ),
      },

    });
    console.log("switchboard loaded and queue created");


    oracle = await NodeOracle.fromReleaseChannel({
      chain: "solana",
      // use the latest testnet (devnet) version of the oracle
      releaseChannel: "testnet",
      // disables production capabilities like monitoring and alerts
      network: "localnet",
      rpcUrl: provider.connection.rpcEndpoint,
      oracleKey: switchboard.oracle.publicKey.toBase58(),
      // path to the payer keypair so the oracle can pay for txns
      secretPath: switchboard.walletPath || "~/.config/solana/id.json",
      // set to true to suppress oracle logs in the console
      silent: false,
      // optional env variables to speed up the workflow
      envVariables: {
        VERBOSE: "1",
        DEBUG: "1",
        DISABLE_NONCE_QUEUE: "1",
        DISABLE_METRICS: "1",
      },
    });
    console.log("Oracle created");


    // start the oracle and wait for it to start heartbeating on-chain
    await oracle.startAndAwait();
    console.log("Got oracle heartbeat");
  });

  after(() => {
    oracle?.stop();
  });

  it("Creates a static feed that resolves to 100", async () => {
    [aggregatorAccount] = await switchboard.queue.createFeed({
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 10,
      fundAmount: 0.15,
      enable: true,
      slidingWindow: true,
      jobs: [
        {
          data: OracleJob.encodeDelimited(
            OracleJob.fromObject({
              tasks: [
                {
                  valueTask: {
                    value: 100,
                  },
                },
              ],
            })
          ).finish(),
        },
      ],
    });

    const aggregator = await aggregatorAccount.loadData();
    const [updatedState] = await aggregatorAccount.openRoundAndAwaitResult();
    const result = AggregatorAccount.decodeLatestValue(updatedState);
    assert(result.toNumber() === 100, "Aggregator result mismatch");
  });
});
