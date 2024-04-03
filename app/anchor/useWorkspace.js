import { computed } from "vue";
import { useAnchorWallet, useWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";


import idl from "../../target/idl/satik.json";

const preflightCommitment = "processed";
const commitment = "confirmed";


const programID = new PublicKey(idl.metadata.address);

import { initWallet } from "solana-wallets-vue";

const walletOptions = {
  wallets: [
    // new PhantomWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

initWallet(walletOptions);
const { publicKey, sendTransaction } = useWallet();

 function initWorkspace()  {
  const wallet = useAnchorWallet();
  const connection = new Connection('http://localhost:8899', commitment);
  const provider = computed(
    () =>
      new AnchorProvider(connection, wallet.value, {
        preflightCommitment,
        commitment,
      })
  );
  const program = computed(() => new Program(idl, programID, provider.value));


  
  return {
    wallet,
    connection,
    provider,
    program
  };
};


export default initWorkspace;