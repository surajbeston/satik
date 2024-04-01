<template>
  <div class="flex gap-10">
    <div
      class="border-2 border-primary-30 w-[200px] cursor-pointer rounded-xl relative overflow-hidden"
    >
      <div class="w-full h-full" v-if="!productImage">
        <input
          @change="onFileSelected"
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
          :src="productImage"
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
    <div>
      <div>
        <label class="block pb-4 text-xl font-semibold" for="productName"
          >Product Name:</label
        >
        <input
          v-model="produtName"
          class="w-[300px] bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-3 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text"
          name="productName"
          id="productName"
          placeholder="Product Name"
        />
      </div>

      <div class="my-6">
        <label class="block pb-4 text-xl font-semibold" for="productDescription"
          >Product Description:</label
        >
        <textarea
          v-model="productDescription"
          cols="30"
          rows="5"
          class="w-[300px] bg-transparent border-primary-50 font-bold shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text"
          name="productName"
          id="productName"
          placeholder="Product Description"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const productImage = ref(null);
const produtName = ref("");
const productDescription = ref("");

const onFileSelected = (event) => {
  const file = event.target.files[0];
  productImage.value = URL.createObjectURL(file);
};
</script>

<style scoped></style>
