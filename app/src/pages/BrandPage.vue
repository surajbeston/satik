<template>
  <div>
    <h1
      class="text-5xl text-center font-inria-sans font-semibold my-6 py-6 text-secondary-0"
    >
      All Brands
    </h1>
    <div class="flex justify-end relative">
      <input
        :value="brandSearch"
        @input="handleSearch"
        type="text"
        placeholder="Search brands"
        class="w-[300px] px-4 py-2 rounded-xl outline-none bg-primary-80 mr-0 ml-auto"
      />
      <!-- <img
        v-if="brandSearch"
        @click="
          brandSearch = '';
          handleSearch({ target: { value: '' } });
        "
        class="absolute right-3 top-[11px] h-4 w-4 cursor-pointer"
        src="../../assets/icons/cross.svg"
        alt="empty"
      /> -->
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-auto gap-4 py-4"
    >
      <BrandCard
        v-for="brand in brands"
        :brand="brand.account"
        :key="brand.username"
      />
    </div>
  </div>
</template>

<script setup>
import { fetchAllBrands } from "../../anchor/utils";

import { ref, onMounted } from "vue";
import BrandCard from "../components/BrandCard.vue";

const brands = ref([]);
const brandSearch = ref("");

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
