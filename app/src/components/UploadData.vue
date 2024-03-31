<template>
    <div>
        <button @click="sendData">Send Data</button>
    </div>
</template>

<script setup>



import { ref } from 'vue';
import {  initWorkspace } from "../../anchor/useWorkspace.js";
import {Keypair} from "@solana/web3.js";

import { useWallet } from 'solana-wallets-vue';
import BN from 'bn.js';

function sendData() {
    console.log("Data is here!")
}



</script>