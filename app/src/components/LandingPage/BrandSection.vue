<template>
  <div class="relative py-8">
    <DividerPattern />
    <img class="w-12 h-12" src="../../assets/icons/branding.png" alt="brand" />
    <div class="flex items-center justify-between relative z-10 my-5">
      <h1 class="text-3xl font-inria-sans text-secondary-0 font-semibold">
        Brands
      </h1>
      <RouterLink
        class="text-lg underline text-secondary-10 underline-offset-4 hover:text-secondary-30 font-medium duration-300"
        to="/brands"
        >See all
      </RouterLink>
    </div>
    <div class="flex justify-end relative">
      <input
        :value="brandSearch"
        @input="handleSearch"
        type="text"
        placeholder="Search brands"
        class="w-[300px] px-4 py-2 rounded-xl outline-none bg-primary-80 mr-0 ml-auto"
      />
      <img
        v-if="brandSearch"
        @click="
          brandSearch = '';
          handleSearch({ target: { value: '' } });
        "
        class="absolute right-3 top-[11px] h-4 w-4 cursor-pointer"
        src="../../assets/icons/cross.svg"
        alt="empty"
      />
    </div>
    <div
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
      class="grid gap-4 justify-center items-stretch py-6 min-h-[470px]"
    >
      <BrandCard
        v-for="brand in brands.slice(0, 4)"
        :key="brand.usename"
        :brand="brand.account"
      />
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
import BrandCard from "../BrandCard.vue";

import { onMounted, ref } from "vue";
import { fetchAllBrands } from "../../../anchor/utils";
const brandSearch = ref("");

const brands = ref([]);

onMounted(async () => {
  brands.value = await fetchAllBrands();
});

const handleSearch = async (e) => {
  brandSearch.value = e.target.value;
  brands.value = brands.value.filter((brand) => {
    return brand.account.name
      .toLowerCase()
      .includes(brandSearch.value.toLowerCase());
  });
  if (brandSearch.value === "") {
    brands.value = await fetchAllBrands();
  }
};
</script>

<style scoped></style>
