import * as anchor from "@coral-xyz/anchor";
import { Satik } from "../target/types/satik";
import { NodeOracle } from "@switchboard-xyz/oracle";
import {
  SwitchboardProgram,
  SwitchboardTestContext,
} from "@switchboard-xyz/solana.js";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.Satik as anchor.Program<Satik>;

const oracleKeypair = SwitchboardTestContext.loadKeypair(
  "./keypairs/oracle1.json"
);

(async () => {
  const switchboard = await SwitchboardProgram.fromProvider(provider);

  const nodeOracle = await NodeOracle.fromReleaseChannel({
    chain: "solana",
    releaseChannel: "testnet",
    network: "localnet",
    rpcUrl: switchboard.connection.rpcEndpoint,
    oracleKey: oracleKeypair.publicKey.toBase58(),
    secretPath: "./keypairs/oracle1.json",
    silent: false,
    envVariables: {
      VERBOSE: "1",
      DEBUG: "1",
      DISABLE_NONCE_QUEUE: "1",
      DISABLE_METRICS: "1",
    },
  });
})();
