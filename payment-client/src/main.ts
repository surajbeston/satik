import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { AnchorProvider, Program } from "@project-serum/anchor";
import idl from "../idl.json";

import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

import { SolanaConnect } from "solana-connect";
//@ts-ignore
import { toast } from "https://cdn.jsdelivr.net/npm/vue3-toastify@0.1.13/+esm";

const commitment = "confirmed";
const preflightCommitment = "processed";
const programID = new PublicKey(idl.metadata.address);

const connection = new Connection(clusterApiUrl("devnet"), commitment);

const solConnect = new SolanaConnect();

solConnect.openMenu();

var program: Program;
var wallet;
var provider;

solConnect.onWalletChange(async () => {
  wallet = solConnect.getWallet();
  //@ts-ignore
  provider = new AnchorProvider(connection, wallet, {
    preflightCommitment,
    commitment,
  });

  program = getProgram(provider);
});

solConnect.onVisibilityChange((isOpen: boolean) => {
  console.log("menu visible:", isOpen);
});

function getProgram(provider: AnchorProvider): Program {
  // @ts-ignore
  const program = new Program(idl, programID, provider);
  return program;
}
// @ts-ignore
async function purchase(productAddressString: string) {
  const mint = new PublicKey("8TYBs78yzk662G5oDv84um73Xthy51nu4mkgKNYcZjzy");

  const productAddress = new PublicKey(productAddressString);

  const product = await program.account.product.fetch(productAddress);

  const proposalAddress = product.proposal as PublicKey;

  const proposal = await program.account.proposal.fetch(proposalAddress);

  const purchaseId = Math.random().toString(36).slice(2);

  const [purchaseAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from(purchaseId)],
    program.programId
  );

  const escrow = await getAssociatedTokenAddress(mint, purchaseAddress, true);

  const customer_ATA = await getAssociatedTokenAddress(
    mint,
    wallet?.publicKey as PublicKey
  );

  console.log(customer_ATA.toBase58());

  const rent = new PublicKey("SysvarRent111111111111111111111111111111111");

  const tx4 = await program.methods
    .purchase(purchaseId)
    .accounts({
      purchase: purchaseAddress,
      proposal: proposalAddress,
      product: productAddress,
      brandAta: proposal.brandAta as PublicKey,
      influencerAta: proposal.influencerAta as PublicKey,
      customerAta: customer_ATA,
      usdcTokenAccount: escrow,
      mint: mint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: rent,
    })
    .rpc();
  toast("Product Purchased", { autoClose: 2000, type: "success" });
  console.log(tx4);
}

function addListeners() {
  const products = document.querySelectorAll('[class^="product-"]');
  products.forEach((product) => {
    product.addEventListener("click", async () => {
      toast("Purchasing...", { autoClose: 2000 });
      const address = product.getAttribute("class")?.replace("product-", "")!;
      try {
        purchase(address);
      } catch (error) {
        toast("Something went wrong", { autoClose: 2000, type: "error" });
      }
    });
  });
}

addListeners();

// const program =  new Program(idl, programID, provider.value)
