<template>
  <div class="py-8 relative">
    <DividerPattern />
    <CreativeIcon />
    <div class="flex items-center justify-between relative z-10">
      <h1 class="text-3xl font-inria-sans my-6 text-secondary-0 font-semibold">
        Influencers
      </h1>
      <RouterLink
        class="text-lg underline text-secondary-10 underline-offset-4 hover:text-secondary-30 font-medium duration-300"
        to="/influencers"
        >See all</RouterLink
      >
    </div>
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
        src="../../assets/icons/cross.svg"
        alt="empty"
      />
    </div>
    <div
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
      class="grid gap-4 justify-center items-stretch py-6 min-h-[470px]"
    >
      <template v-if="creators.length > 0">
        <CreatorCard
          v-for="creator in creators.slice(0, 4)"
          :key="creator.usename"
          :creator="creator.account"
        />
      </template>
      <p
        v-else
        class="text-2xl font-open-sans text-neutral-10 font-bold mx-auto"
      >
        No results Found :(
      </p>
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
import CreatorCard from "../InfluencerCard.vue";
import CreativeIcon from "../icons/creativeIcon.vue";

import { fetchAllInfluencers } from "../../../anchor/utils";

import { ref, onMounted } from "vue";

const influencerSearch = ref("");
const creators = ref([]);
onMounted(async () => {
  creators.value = await fetchAllInfluencers();
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
