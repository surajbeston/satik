<template>
  <div class="relative py-8">
    <DividerPattern />
    <img class="w-12 h-12" src="../../assets/icons/branding.png" alt="brand" />
    <div class="flex items-center justify-between relative z-10">
      <h1 class="text-3xl font-inria-sans my-6 text-secondary-0 font-semibold">
        Brands
      </h1>
      <RouterLink
        class="text-lg underline text-secondary-10 underline-offset-4 hover:text-secondary-30 font-medium duration-300"
        to="/creators"
        >See all</RouterLink
      >
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
</script>

<style scoped></style>
