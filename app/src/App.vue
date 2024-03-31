
<template>
  <div>
    <div>
      <wallet-multi-button></wallet-multi-button>
    </div>
    <div class="mt-5">
      <AddProfile></AddProfile>
    </div>
    <div class="mt-5">
      <Profiles></Profiles>
    </div>
  </div>
</template>

<script setup>
import AddProfile from "./components/AddProfile.vue";
import { useWallet, WalletMultiButton } from "solana-wallets-vue";
import Profiles from "./components/Profiles.vue";

import {ref} from 'vue';
const showChooseWalletOption = ref(true);

const {publicKey} = useWallet();

if (publicKey.value){
  showChooseWalletOption.value = false;
}

</script>




<style scoped>
</style>
