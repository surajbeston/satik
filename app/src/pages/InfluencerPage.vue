<template>
  <div class="min-h-screen">
    <h1
      class="text-5xl text-center font-inria-sans font-semibold my-6 py-6 text-secondary-0"
    >
      All Influencers
    </h1>
    <div class="flex justify-end relative">
      <input
        :value="influencerSearch"
        @input="handleSearch"
        type="text"
        placeholder="Search Influencers"
        class="w-[300px] px-4 py-2 rounded-xl outline-none bg-primary-80 mr-0 ml-auto"
      />
      <img
        v-if="influencerSearch"
        @click="
          influencerSearch = '';
          handleSearch({ target: { value: '' } });
        "
        class="absolute right-3 top-[11px] h-4 w-4 cursor-pointer"
        src="../assets/icons/cross.svg"
        alt="empty"
      />
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-auto grid-rows-auto gap-4 py-4"
    >
      <CreatorCard
        v-for="creator in creators"
        :creator="creator.account"
        :key="creator.username"
      />
    </div>
  </div>
</template>

<script setup>
import CreatorCard from "../components/InfluencerCard.vue";

import { fetchAllInfluencers } from "../../anchor/utils";

import { ref, onMounted } from "vue";

const creators = ref([]);
const influencerSearch = ref("");

onMounted(async () => {
  creators.value = await fetchAllInfluencers();
  console.log(creators.value);
});

const handleSearch = async (e) => {
  influencerSearch.value = e.target.value;

  creators.value = creators.value.filter((creator) => {
    return creator.account.name
      .toLowerCase()
      .includes(influencerSearch.value.toLowerCase());
  });
  if (influencerSearch.value === "") {
    creators.value = await fetchAllInfluencers();
  }
};
</script>

<style scoped></style>
