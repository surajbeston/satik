<template>
  <div class="relative">
    <DividerPattern />
    <img
      class="w-[70px] h-[70px] mb-10"
      src="../../assets/icons/networking.png"
      alt="how it work"
    />
    <h1 class="font-inria-sans text-secondary-0 font-semibold text-3xl">
      How it works
    </h1>
    <div class="py-20">
      <h2 class="text-primary-10 font-semibold pb-16 text-2xl text-center">
        How Product Purchase works
      </h2>
      <img
        class="w-full object-cover"
        src="../../assets/icons/how1.svg"
        alt="how"
      />
    </div>
    <div class="pb-10">
      <h2 class="text-primary-10 font-semibold pb-16 text-2xl text-center">
        How CMP works
      </h2>
      <img src="../../assets/icons/how2.svg" alt="how" />
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
</script>

<style scoped>
.curve {
  background-image: url("../../assets/icons/curve.svg");
  background-repeat: no-repeat;
  background-size: 100% 55%;
  background-position: 0% 50%;
}
</style>
