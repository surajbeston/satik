<template>
  <div class="flex flex-col lg:flex-row gap-10">
    <div
      class="border-2 border-primary-30 w-full lg:w-[20%] min-h-[300px] cursor-pointer rounded-xl relative overflow-hidden"
    >
      <div class="w-full h-full" v-if="!product.productImage">
        <input
          @change="handleFileChange"
          class="w-full h-full opacity-0 cursor-pointer"
          type="file"
          accept="image/*"
        />
        <img
          class="absolute top-1/2 left-1/2 pointer-events-none opacity-60 -translate-x-1/2 -translate-y-1/2"
          src="../../assets/icons/plus.svg"
          alt="add"
        />
      </div>
      <div class="w-full h-full relative" v-else>
        <img
          class="w-full h-full object-cover"
          :src="product.productImage"
          alt="product image"
        />
        <div
          class="absolute right-2 flex justify-center items-center top-2 w-8 h-8 rounded-lg p-2 cursor-pointer bg-primary-90"
        >
          <img
            src="../../assets/icons/cross.svg"
            alt="close"
            @click="productImage = null"
          />
        </div>
      </div>
    </div>
    <div class="w-full lg:w-[50%]">
      <div>
        <label class="block pb-4 text-xl font-semibold" for="productName">
          Name:</label
        >
        <input
          v-model="product.productName"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-3 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text"
          name="productName"
          id="productName"
          placeholder="Product Name"
        />
      </div>

      <div class="my-6">
        <label class="block pb-4 text-xl font-semibold" for="price">
          Total Price:</label
        >
        <input
          v-model="product.totalAmount"
          class="w-full bg-transparent border-primary-50 font-bold shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number"
          name="price"
          id="price"
          placeholder="Product Total price"
        />
      </div>

      <div>
        <label class="block pb-4 text-xl font-semibold" for="InfluencerName">
          Influencer Amount:</label
        >
        <input
          :value="product.influencerAmount"
          @input="handleAmountChange"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-3 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number"
          name="InfluencerName"
          id="InfluencerName"
          placeholder="Influencer amount"
        />
      </div>

      <div class="my-6">
        <label
          class="block pb-4 text-xl font-semibold"
          for="productDescription"
        >
          Description:</label
        >
        <textarea
          v-model="product.productDescription"
          cols="30"
          rows="5"
          class="w-full bg-transparent border-primary-50 font-bold shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text"
          name="productDescription"
          id="productDescription"
          placeholder="Product Description"
        />
      </div>
    </div>
    <div class="self-center w-full lg:w-[30%]">
      <h2 class="text-4xl font-bold">Profit Distribution:</h2>
      <p class="text-xl py-3">
        <span class="text-primary-20 font-bold">{{
          product.influencerAmount
        }}</span>
        would be
        <span class="text-primary-20 font-bold">Influencer</span>

        for every product.
      </p>
      <div>
        <h3 class="font-semibold text-neutral-20 text-xl py-1">
          Influencer Amount:
          <span class="text-neutral-0">{{ product.influencerAmount }}</span>
        </h3>
      </div>
      <div>
        <h3 class="font-semibold text-xl py-1 text-neutral-20">
          Satik Amount :
          <span class="text-neutral-0">{{
            (product.totalAmount * 0.01).toFixed(2)
          }}</span>
        </h3>
      </div>
      <div>
        <h3 class="font-semibold text-xl py-1 text-neutral-20">
          Brand Receive :
          <span class="text-neutral-0">{{
            (
              product.totalAmount -
              product.totalAmount * 0.01 -
              product.influencerAmount
            ).toFixed(2)
          }}</span>
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createClient } from "../../helper/client.js";
import { toast } from "vue3-toastify";

const props = defineProps(["product"]);

console.log("Product", props.product);

const profileHash = ref(null);

const productImage = ref(null);
const produtName = ref("");
const influencerAmount = ref(0);
const totalAmount = ref("");
const productDescription = ref("");

const sendingImage = ref(false);

const profilePicture = ref(null);

const handleFileChange = async (event) => {
  sendingImage.value = true;
  toast("Uploading profile picture...", { autoClose: 2000 });
  try {
    const file = event.target.files[0];
    profilePicture.value = URL.createObjectURL(file);
    profileHash.value = await createClient(file);
  } catch (error) {
    console.log(error);
    toast("Something went wrong while uploading profile picture", {
      autoClose: 3000,
      type: "error",
    });
  }
  toast("Profile picture uploaded", { autoClose: 2000, type: "success" });

  props.product.productImage = `https://${profileHash.value}.ipfs.w3s.link`;

  console.log(props.product);

  sendingImage.value = false;
};

const handleAmountChange = (event) => {
  console.log(event.target.value);

  influencerAmount.value = event.target.value;

  console.log("Influencer value", influencerAmount.value);
  console.log("Total value", props.product.totalAmount);

  if (influencerAmount.value > props.product.totalAmount) {
    toast("Influencer amount should be less than total amount", {
      autoClose: 2000,
      type: "error",
    });
    event.target.classList.add("border-red");
    props.product.influencerAmount = totalAmount.value * 0.1;
  } else {
    event.target.classList.remove("border-red");
    props.product.influencerAmount = event.target.value;
  }
};
</script>

<style scoped>
.border-red {
  border-color: brown;
}
</style>
