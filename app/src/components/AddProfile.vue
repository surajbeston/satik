<template>
    <div class ="border-2 w-[500px]">
        <h1 class = "text-2xl font-bold">Add Profile</h1>

        <!-- A form with input fields for name, bio, date of birth, and profile picture -->
        <div class="flex flex-col space-y-4 mt-5 ">
          <div>
            <label for="name" class="font-bold">Name:</label>
            <input type="text" id="name" v-model="name" class="border border-gray-300 rounded-md p-2">
          </div>

          <div>
            <label for="bio" class="font-bold">Bio:</label>
            <input type="text" id="bio" v-model="bio" class="border border-gray-300 rounded-md p-2">
          </div>
        
          <div>
            <label for="dob" class="font-bold">Username:</label>
            <input type="text" id="dob" v-model="username" class="border border-gray-300 rounded-md p-2">
          </div>
        
          <div>
            <label for="picture" class="font-bold">Profile Picture:</label>
            <input type="text" id="picture" v-model="picture" class="border border-gray-300 rounded-md p-2">
          </div>

          <button @click="addProfile" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Profile
          </button>
        </div>
    </div>
</template>

<script setup>


import { ref } from 'vue';
import {  initWorkspace } from "../../anchor/useWorkspace.js";
import {Keypair} from "@solana/web3.js";

import { useWallet } from 'solana-wallets-vue';
import BN from 'bn.js';



const name = ref("john");
const bio = ref("this is me");
const username = ref(3);
const picture = ref("asdfdf");

var num = new BN(1);


async function addProfile() {
  const { program } = initWorkspace();

  const { wallet} = useWallet();

  const kp = new Keypair();
  try{
    const tx = await program.value.methods
        .initializeBrand(name.value, 'df', username.value, bio.value, picture.value)
        .accounts({
            profile: kp.publicKey
        })
        .signers([kp])
        .rpc();
        console.log("https://explorer.solana.com/tx/", tx);

    // location.reload();
    
    }
    catch(err){
        console.log(err);
    }
}

</script>