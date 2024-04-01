<template>
  <div class="flex gap-10">
    <div
      class="border-2 border-primary-30 w-[200px] cursor-pointer rounded-xl relative"
    >
      <input class="w-full h-full opacity-0 cursor-pointer" type="file" />
      <img
        class="absolute top-1/2 left-1/2 pointer-events-none opacity-60 -translate-x-1/2 -translate-y-1/2"
        src="../../assets/icons/plus.svg"
        alt="add"
      />
    </div>
    <div>
      <div>
        <label class="block pb-4 text-xl font-semibold" for="productName"
          >Product Name:</label
        >
        <input
          v-model="productImage"
          class="w-[300px] bg-transparent border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-3 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text"
          name="productName"
          id="productName"
          placeholder="Product Name"
        />
      </div>
      <pre>{{ productImage }}</pre>
      <div class="my-6">
        <label class="block pb-4 text-xl font-semibold" for="productDescription"
          >Product Description:</label
        >
        <textarea
          cols="30"
          rows="5"
          class="w-[300px] bg-transparent border-primary-50 text-primary-0 font-bold shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold"
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
console.log(productImage.value);
</script>

<style scoped></style>
