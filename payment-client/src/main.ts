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

  const [purchaseAddress, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(purchaseId)],
    program.programId
  );

  console.log("Program ID", program.programId.toBase58())

  console.log("product", product)

  console.log("purchase address ", purchaseAddress.toBase58());
  console.log("bump ", bump);
  const escrow = await getAssociatedTokenAddress(mint, purchaseAddress, true)

  console.log("Proposal: ", proposal);

  const customer_ATA = await getAssociatedTokenAddress(
    mint,
    wallet?.publicKey as PublicKey 
  )
  const url = `https://satik-redeemer-demo.onrender.com/mint?address=${customer_ATA.toBase58()}&amount=${product.totalAmount.toNumber()}`;

  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }

  const rent = new PublicKey("SysvarRent111111111111111111111111111111111");
  try{
    toast("Purchase initiated. Please sign the transaction.", { autoClose: 2000, type: "info" });
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
    console.log(tx4);
    toast("Product purchased.", { autoClose: 2000, type: "success" });
    location.href = `${proposal.redeemerUrl}?purchaseAddress=${purchaseAddress.toBase58()}&bump=${bump}`;
  }
  catch(error){
    console.log(error)
    toast("Something went wrong", { autoClose: 2000, type: "error" });
  } 
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
        console.log(error)
        toast("Something went wrong", { autoClose: 2000, type: "error" });
      }
    });
  });
}

addListeners();

// const program =  new Program(idl, programID, provider.value)
