<template>
  <div>
    <h1
      class="text-5xl text-center font-inria-sans font-semibold my-6 py-6 text-secondary-0"
    >
      All Creators
    </h1>
    <div class="grid grid-cols-4 grid-rows-auto gap-4 py-4">
      <CreatorCard
        v-for="creator in creators"
        :creator="creator.account"
        :key="creator.username"
      />
    </div>
  </div>
</template>

<script setup>
import CreatorCard from "../components/CreatorCard.vue";

import {fetchAllInfluencers} from '../../anchor/utils';

import {ref, onMounted} from "vue";

const creators = ref([])


onMounted(async () => {
  creators.value = await fetchAllInfluencers();
  console.log(creators.value);
})


</script>

<style scoped></style>
