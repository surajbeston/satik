<template>
  <div
    class="min-h-[60vh] w-full flex gap-4 flex-col lg:flex-row justify-between items-center mt-16 mb-6 relative"
  >
    <Pattern />
    <div
      class="w-full lg:w-1/2 mx-auto text-center lg:text-start relative z-10"
    >
      <h1
        class="text-[28px] md:text-[50px] text-neutral-0 font-bold font-open-sans text-center"
      >
        Decentralized payment for influence
      </h1>
      <p class="text-xl py-6 text-center">
        Satik helps create on chain contracts between influencers and brands where influencers are paid for both views and purchases on the fly.
      </p>
    </div>

    <div class="w-full lg:w-1/2 h-[44vh] sm:h-[70vh] font-advent-pro">
      <SatikIcon />
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
import SatikIcon from "../icons/SatikIcon.vue";
import Pattern from "../Pattern.vue";
</script>

<style scoped></style>
