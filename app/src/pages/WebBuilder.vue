<template>
  <div class="editor-container mx-auto relative">
    <!-- modal -->
    <div
      v-if="showModal"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/70 h-screen w-screen flex justify-center items-center"
    >
      <div class="p-6 bg-primary-60 rounded-xl shadow-2xl w-[500px] h-[420px]">
        <img
          @click="showModal = false"
          class="w-4 h-4 mr-0 ml-auto cursor-pointer"
          src="../assets/icons/cross.svg"
          alt="close"
        />
        <h3 class="text-2xl font-bold">Instructions:</h3>
        <ul style="list-style: disc" class="ml-6 pb-6 space-y-3 py-4">
          <li class="text-lg font-semibold text-neutral-10">
            Drag and drop the component to build website from scratch
          </li>
          <li class="text-lg font-semibold text-neutral-10">
            Link your product to the button (like button, or card)
          </li>
          <li class="text-lg font-semibold text-neutral-10">
            When you finish just click on save and send the proposal to the
            influencer
          </li>
        </ul>
        <p class="text-2xl font-bold text-secondary-0">
          Before sending proposal please make sure you have saved.
        </p>
        <p class="text-lg font-semibold text-neutral-10 pt-3 text-center">
          Happy Building!
        </p>
      </div>
    </div>
    <!-- modal end -->
    <div
      class="border-4 border-secondaryLight-10"
      ref="editorEl"
      style="width: 100%; height: 90vh"
      id="gjs"
    ></div>
    <div class="w-full flex py-8">
      <button
        class="w-full bg-primary-20 py-2 font-bold text-lg"
        @click="getCode"
      >
        Save
      </button>
      <button
        class="w-full bg-secondaryLight-20 font-bold text-lg"
        @click="showConfirmModal = true"
      >
        Send Proposal
      </button>
    </div>
    <Modal
      v-if="showConfirmModal"
      @closeModal="closeModal"
      @sendProposal="handleSendProposal"
    />
  </div>
</template>

<script setup>
import Modal from "../components/Modal.vue";
import { toast } from "vue3-toastify";
import { onMounted, ref } from "vue";
// grapes and grapes plugins
import grapesjs from "grapesjs";
import grapesjsblocks from "grapesjs-blocks-basic";
import BN from "bn.js";

import { store } from "../store.js";

import webpage from "grapesjs-preset-webpage";
import grjNavbar from "grapesjs-navbar";
import plugin from "grapesjs-advance-components";
import { createHtml } from "../helper/htmlCreator";

import "grapesjs/dist/css/grapes.min.css";
// web3 storage
import { createClient } from "../helper/client";
import {
  initializeProposal,
  initializeProduct,
  fetchAllBrands,
  fetchAllInfluencers,
} from "../../anchor/utils";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { useRoute } from "vue-router";

const route = useRoute();

const editor = ref(null);
const editorEl = ref(null);
const selectedProduct = ref(null);
const products = ref([]);
const showModal = ref(true);
const showConfirmModal = ref(false);

onMounted(async () => {
  const data = localStorage.getItem("products");
  if (!data) {
    location.href = "/";
  }
  products.value = JSON.parse(data);

  editor.value = grapesjs.init({
    container: "#gjs",
    plugins: [grapesjsblocks, webpage, grjNavbar, plugin],
  });

  editor.value.on("component:selected", (model) => {
    let className;
    console.log(selectedProduct.value.product);
    if (selectedProduct.value) {
      className = `product-${selectedProduct.value.product.id}`;
      model.setAttributes({
        class: className,
      });

      toast("Product linked.", { autoClose: 1000 });
      // clean selected product and remove clicked class
      selectedProduct.value.div.classList.remove("clicked");
      selectedProduct.value = null;
    }
  });

  setTimeout(() => {
    insetProduct();
  }, 1000);
});

const handleSendProposal = () => {
  sendProposal();
  showConfirmModal.value = false;
};
const closeModal = () => {
  showConfirmModal.value = false;
};
const productClicked = (div, product) => {
  // unselect, selected component  on canvas
  editor.value.select(null);
  console.log(product);

  selectedProduct.value = null;
  if (div.classList.contains("selected")) {
    div.classList.remove("selected");
  } else {
    toast(
      `Product Selected. Click on component you want to link "${product.productName}"`,
      {
        autoClose: 2000,
      }
    );
    selectedProduct.value = { div, product };
    if (selectedProduct.value.div) div.classList.add("selected");
  }
};
const insetProduct = () => {
  const element = editorEl.value.querySelector(
    "div.gjs-pn-panels >div:last-child"
  );
  products.value.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product_container");
    div.addEventListener("click", () => productClicked(div, product));
    div.innerHTML = `
      <img class="product_image" src="${product.productImage}" alt="${product.name}"/>
      <p class="product_name">${product.productImage}</p>
    `;
    element.insertBefore(div, element.firstChild);
  });
};

async function sendProposal() {
  const brands = await fetchAllBrands();

  const { publicKey } = useWallet();
  var brandAddress = null;
  for (var brand of brands) {
    if (brand.account.createdBy.toBase58() == publicKey.value.toBase58()) {
      brandAddress = brand.publicKey;
    }
  }
  const influencerAddressString = localStorage.getItem("influencerAddress");
  const influencerAddress = new PublicKey(influencerAddressString);
  toast("Sending Proposal", { autoClose: 2000 });
  const proposalAddress = await initializeProposal(
    "gh",
    influencerAddress,
    brandAddress
  );
  for (var product of products.value) {
    let productAddress = await initializeProduct(
      product.productName,
      product.productDescription,
      new BN(product.totalAmount),
      new BN(product.influencerAmount),
      proposalAddress
    );
    product.productAddress = productAddress;
    console.log("Product Address: ", productAddress.toBase58());
  }
  toast("Proposal successfully sent.", { autoClose: 2000 });
  console.log(proposalAddress.toBase58());
}

const getCode = async () => {
  sendProposal();

  const html = editor.value.getHtml();
  const cssCode = editor.value.getCss({ clean: true });

  //   combine css to the html file
  const code = createHtml(html, cssCode, products);

  const files = [new File([code], "index.html")];
  const blob = new Blob([code], { type: "text/html" });
  const cid = await createClient(blob);
  const url = `https://${cid}.ipfs.w3s.link`;
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = url;
  link.click();
};
</script>

<style>
.gjs-pn-devices-c {
  left: 0;
}
.editor-container {
  width: 1200px;
  margin: 0 auto;
}
.product_container {
  width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-block: 1rem;
  padding-block: 0.8rem;
}
.selected {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
  border: 1px solid #d97aa6;
}
.product_container:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
}
.product_image {
  height: 50px;
  width: 50px;
  object-fit: cover;
}
</style>
