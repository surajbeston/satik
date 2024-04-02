<template>
  <div>
    <
    <h1>Creator Login</h1>
    <form class="" action="">
      <div>
        <label  for="name">Name:</label>
        <input class ="text-black	" type="text" placeholder="Name" id="name" name="name" />
      </div>
      <div>
        <label for="userName">Username:</label>
        <input
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
    <button class ="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Create Influencer Profile </button>
  </div>
</template>

<script setup>
import { WalletMultiButton } from "solana-wallets-vue";


import  initWorkspace from "../../anchor/useWorkspace.js";

const { wallet,connection, provider, program } = initWorkspace();

console.log(wallet)
console.log(connection)


</script>

<style scoped></style>
