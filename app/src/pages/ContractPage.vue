<template>
  <div class="py-16">
    <div>
      <h1 class="text-center text-4xl font-bold pb-4">FILL IN THE DETAILS</h1>
      <div
        class="bg-primary-80 p-2 shadow-2xl rounded-xl border border-primary-60 my-8"
      >
        <form
          @submit.prevent="handleSubmit"
          class="border-2 border-primary-60 p-6 rounded-xl"
        >
          <div>
            <label class="text-2xl block pb-5 lg:pb-10" for=""
              >Add Products:</label
            >
            <div
              class="py-5 lg:py-10 border-b border-primary-40"
              v-for="product in store.products"
              :key="product"
            >
              <ProductDetail :product="product" />
            </div>
          </div>
          <div
            class="w-full lg:w-[60%] mx-auto flex flex-col gap-4 md:flex-row font-semibold justify-center items-center pt-8"
          >
            <button
              @click="addProduct"
              class="bg-primary-0 py-2 w-full"
            >
              Add Product
            </button>
            <button 
              @click="goToBuilder()"
              type="submit"
              class="bg-secondaryLight-20 font-semibold w-full py-2 text-center mx-auto"
            >
              Build Page
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ProductDetail from "../components/ContractPage/productDetail.vue";
import { store } from '../store.js'
import {toast} from 'vue3-toastify';

import { useWallet } from "solana-wallets-vue";
// import { router } from 'vue-router'

import { useRouter, useRoute } from 'vue-router';

var idCount = 1;

const route = useRoute()

import { initializeProposal, fetchAllInfluencers, fetchAllBrands } from '../../anchor/utils'
import { PublicKey } from "@solana/web3.js";

const products = ref([{id: 1, productImage: "", productName: "", influencerAmount: 0, totalAmount: 0, productDescription: ""}]);

function addProduct() {
  console.log(store.products);
  idCount += 1;
  store.products.push({id: idCount, productImage: "", productName: "", influencerAmount: 0, totalAmount: 0, productDescription: ""})
}

function goToBuilder() {
  var validProduct = true;
  for(var product of store.products) {
    if (!product.productDescription || !product.productName || !product.totalAmount || !product.productImage) {
      validProduct = false;
      break;
    }
  }
  if (validProduct) {
    localStorage.setItem("influencerAddress", route.params.id);
    location.href = "/builder";
  }
  else{
    toast("Product name, description, amount and image are required", {autoClose: 3000, type: 'error' })
  }
}



watch(store.products, (newProducts) => {
  localStorage.setItem("products", JSON.stringify(newProducts));
  const products = localStorage.getItem("products");
})

</script>

<style scoped></style>
