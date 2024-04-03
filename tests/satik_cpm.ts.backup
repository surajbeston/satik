import * as anchor from "@coral-xyz/anchor";
import { Satik } from "../target/types/satik";
import { SwitchboardTestContext } from "@switchboard-xyz/solana.js";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { payerKeypair } from "../src_js/constants";

describe("satik test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Satik as anchor.Program<Satik>;
  const creatorKeypair = SwitchboardTestContext.loadKeypair(
    "./keypairs/creator1.json"
  );

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

  it("create deal", async () => {
    await program.methods
      .createDeal({
        initialAmount: new BN(1000),
        initialAmountOnReach: new BN(1000),
        startsOn: new BN(Date.now() / 1000),
        startsOnReach: new BN(1000),
        endsOn: null,
        endsOnReach: null,
        cpm: new BN(1),
        creatorPk: creatorKeypair.publicKey,
        contentUrl: "https://eoo6aio1mbtg4nl.m.pipedream.net",
        idSeed,
      })
      .accounts({
        deal: dealPDA,
        payer: payerKeypair.publicKey,
      })
      .rpc();
  });

  it("show deal", async () => {
    const deal = await program.account.deal.fetch(dealPDA);
    console.log(deal);
  });
});
