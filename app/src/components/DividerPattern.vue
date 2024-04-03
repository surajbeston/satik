<template>
  <div
    :style="`height: ${height}; background-image: url(${bgUrl});`"
    class="pattern-container absolute inset-0 w-full h-full z-0"
  ></div>
</template>

<script setup>
defineProps({
  height: {
    default: "160px",
  },
  bgUrl: {
    default: "/src/assets/patterns/pattern_1.svg",
  },
});
</script>

<style scoped>
.pattern-container {
  background-color: inherit;
  background-repeat: repeat;
  width: 100%;
  height: 100%;
  background-origin: border-box;
}
</style>
