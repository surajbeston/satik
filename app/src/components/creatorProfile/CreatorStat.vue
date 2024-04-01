<template>
  <div
    class="text-center w-full"
    :class="{ 'border-r-2 border-secondaryLight-20': border }"
  >
    <h4 class="text-3xl font-bold text-secondaryLight-20">{{ stat.number }}</h4>
    <p
      class="text-base font-medium font-inria-sans text-secondaryLight-60 w-min text-center mx-auto"
    >
      {{ stat.description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  stat: {
    number: String,
    description: String,
  },
  border: {
    default: true,
    type: Boolean,
  },
});
</script>

<style scoped></style>
