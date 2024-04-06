<template>
  <div class="py-16">
    <div>
      <h1 class="text-center text-4xl font-bold pb-4">Create Proposal</h1>
      <div
        class="bg-primary-80 p-2 shadow-2xl rounded-xl border border-primary-60 my-8"
      >
        <form
          @submit.prevent="handleSubmit"
          class="border-2 border-primary-60 p-6 rounded-xl"
        >
          <div>
            <label class="text-2xl block pb-5 lg:pb-10 border-b" for=""
              >Add Products</label
            >
            <div
              class="py-5 lg:py-10 border-b border-primary-40"
              v-for="product in store.products"
              :key="product"
            >
              <ProductDetail :product="product" />
            </div>
          </div>
          <div class="mt-10">
            <label class="block font-semibold text-xl" for="message"
              >Message to Influencer:</label
            >
            <textarea
              v-model="proposalMessage"
              class="bg-transparent border-[3px] py-2 indent-4 rounded-xl outline-none w-full my-3 border-primary-30 placeholder:text-primary-30 font-semibold"
              cols="30"
              rows="5"
              type="text"
              placeholder="Message to Influencer"
              id="message"
              name="message"
            />
          </div>
          <div>
            <label class="block font-semibold text-xl pb-4" for="redeemLink"
              >Redeem Link</label
            >
            <input
              class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-3 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
              type="text"
              name="redeemLink"
              id="redeemLink"
              placeholder="Your redeem link..."
            />
          </div>
          <div
            class="w-full lg:w-[60%] mx-auto flex flex-col gap-4 md:flex-row font-semibold justify-center items-center pt-8"
          >
            <button @click="addProduct" class="bg-primary-0 py-2 w-full">
              Add Product
            </button>
            <button
              @click="showModal = true"
              type="submit"
              class="bg-secondaryLight-20 font-semibold w-full py-2 text-center mx-auto"
            >
              Send Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
    <Modal
      v-if="showModal"
      @handleSendClick="sendProposal"
      @closeModal="closeModal"
      message="Your proposal will be sent."
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ProductDetail from "../components/ContractPage/productDetail.vue";
import { store } from "../store.js";
import { toast } from "vue3-toastify";
import Modal from "../components/Modal.vue";

import { useWallet } from "solana-wallets-vue";
// import { router } from 'vue-router'

import { useRouter, useRoute } from "vue-router";

var idCount = 1;

const route = useRoute();
const router = useRouter();
const showModal = ref(false);

import {
  initializeProposal,
  fetchAllInfluencers,
  fetchAllBrands,
  initializeProposalWithProducts,
} from "../../anchor/utils";
import { PublicKey } from "@solana/web3.js";

const proposalMessage = ref("");

const products = ref([
  {
    id: 1,
    productImage: "",
    productName: "",
    influencerAmount: 0,
    totalAmount: 0,
    productDescription: "",
  },
]);

const sendProposal = () => {
  showModal.value = false;
  goToBuilder();
};
const closeModal = () => {
  showModal.value = false;
};

function addProduct() {
  console.log(store.products);
  idCount += 1;
  store.products.push({
    id: idCount,
    productImage: "",
    productName: "",
    influencerAmount: 0,
    totalAmount: 0,
    productDescription: "",
  });
}

function goToBuilder() {
  var validProduct = true;
  for (var product of store.products) {
    if (
      !product.productDescription ||
      !product.productName ||
      !product.totalAmount ||
      !product.productImage
    ) {
      validProduct = false;
      break;
    }
  }
  if (validProduct) {
    // localStorage.setItem("influencerAddress", route.params.id);
    // location.href = "/builder";
    createContract();
  } else {
    toast("Product name, description, amount and image are required", {
      autoClose: 3000,
      type: "error",
    });
  }
}

async function createContract() {
  console.log(store.products);
  if (store.currentUserLoaded) {
    const influencerAddress = new PublicKey(route.params.id);
    const brandAddress = store.currentUser.publicKey;
    console.log(proposalMessage.value);
    toast("Sending proposal. Please sign the transaction.", {
      autoClose: 5000,
      type: "info",
    });
    const [products, proposalAddress] = await initializeProposalWithProducts(
      proposalMessage.value,
      influencerAddress,
      brandAddress,
      store.products
    );
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("proposalAddress", proposalAddress);
    toast("Contract created successfully. Redirecting to web builder.", {
      autoClose: 3000,
      type: "success",
    });
    router.push("/builder");
  } else {
    toast("Brand address not available", { autoClose: 3000, type: "error" });
  }
}

watch(store.products, (newProducts) => {
  localStorage.setItem("products", JSON.stringify(newProducts));
  const products = localStorage.getItem("products");
});
</script>

<style scoped></style>
