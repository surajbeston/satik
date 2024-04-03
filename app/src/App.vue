s<script setup>
import Header from "./components/Header.vue";
import Wrapper from "./components/Wrapper.vue";
import { WalletMultiButton } from "solana-wallets-vue";

</script>

<template>
  <div class="bg-primary min-h-screen text-neutral-0">
    <div class="flex justify-end m-5 mt-5">
      <wallet-multi-button dark></wallet-multi-button>
    </div>
    <Wrapper>
      <Header />

      <main>
        <RouterView />
      </main>
    </Wrapper>
  </div>
</template>

<style scoped></style>
