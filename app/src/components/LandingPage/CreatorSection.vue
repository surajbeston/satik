<template>
  <div class="py-8 relative">
    <DividerPattern  />
    <CreativeIcon />
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-inria-sans my-6 text-secondary-0 font-semibold">
        Creators
      </h1>
      <RouterLink
        class="text-lg underline text-secondary-10 underline-offset-4 hover:text-secondary-30 font-medium duration-300"
        to="/creators"
        >See all</RouterLink
      >
    </div>

    <div
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
      class="grid gap-4 justify-center items-stretch py-6"
    >
      <CreatorCard
        v-for="creator in creators.slice(0, 4)"
        :key="creator.usename"
        :creator="creator.account"
      />
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
import CreatorCard from "../CreatorCard.vue";
import CreativeIcon from "../icons/creativeIcon.vue";

import {fetchAllInfluencers} from '../../../anchor/utils';

import {ref, onMounted} from "vue";

const creators = ref([])


onMounted(async () => {
  creators.value = await fetchAllInfluencers();
})


</script>

<style scoped></style>
