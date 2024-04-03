<template>
  <div>
    <h1>Creator Login</h1>
    <form class="" action="">
      <div>
        <label  for="name">Name:</label>
        <input v-model="name" class ="text-black	" type="text" placeholder="Name" id="name" name="name" />
      </div>
      <div>
        <label for="userName">Username:</label>
        <input
          v-model="username" 
          class ="text-black	"
          type="text"
          placeholder="username"
          id="userName"
          name="userName"
        />
      </div>
      <div>
        <label for="description">Bio:</label>
        <textarea
          v-model="bio"
          class ="text-black"
          cols="30"
          rows="5"
          type="text"
          placeholder="Description"
          id="description"
          name="description"
        />
      </div>
    </form>
    <button @click="createInfluencer" class ="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Create Influencer Profile </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import * as anchor from "@coral-xyz/anchor";
// import { initWallet } from "solana-wallets-vue";
import {toast} from 'vue3-toastify';

import  initWorkspace from "../../anchor/useWorkspace.js";
import {createInfluencerAccount} from "../../anchor/utils";
import Buffer from 'buffer';

import { getAssociatedTokenAddress,
    createMint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAccount, 
    mintTo,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccount,
    transfer } from '@solana/spl-token';



  const walletOptions = {
  wallets: [
    // new PhantomWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};


// initWallet(walletOptions);


const name = ref("name");
const username = ref("username");
const bio = ref("bio");

// const { wallet, influencers };

async function createInfluencer() {
  toast("Creating Profile", { autoClose: 2000 });
  try{
    await createInfluencerAccount(username.value, name.value, "profile", bio.value);
    toast("Profile Created", { autoClose: 2000 });
  }
  catch{
    // console.log(error)
    toast("Somethig went wrong while creating profile", { autoClose: 2000, type: "error" });
  }
}

</script>

<style scoped></style>
