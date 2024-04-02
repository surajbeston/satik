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
        :creator="creator"
        :key="creator.id"
      />
    </div>
  </div>
</template>

<script setup>
import CreatorCard from "../components/CreatorCard.vue";
import { creators } from "../constant/index";
</script>

<style scoped></style>
