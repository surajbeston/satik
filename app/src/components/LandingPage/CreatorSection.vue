<template>
  <div class="py-8">
    <CreativeIcon />
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-inria-sans my-6 text-secondary-0 font-semibold">
        Creators
      </h1>
      <a
        class="text-lg underline text-secondary-10 underline-offset-4 hover:text-secondary-30 font-medium duration-300"
        href="/creators"
        >See All</a
      >
    </div>

    <div
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
      class="grid gap-4 justify-center items-stretch py-6"
    >
      <CreatorCard
        v-for="creator in creators.slice(0, 4)"
        :key="creator.id"
        :creator="creator"
      />
    </div>
  </div>
</template>

<script setup>
import CreatorCard from "../CreatorCard.vue";
import CreativeIcon from "../icons/creativeIcon.vue";
import { creators } from "../../constant/index";
</script>

<style scoped></style>
