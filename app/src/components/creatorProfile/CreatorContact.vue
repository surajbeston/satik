<template>
  <li class="flex gap-4 items-center">
    <div class="bg-secondary-50 p-2 rounded-lg">
      <img class="w-[20px]" :src="contact.iconUrl" alt="call" />
    </div>
    <p class="text-lg font-open-sans font-medium text-secondaryLight-60">
      {{ contact.contactText }}
    </p>
  </li>
</template>

<script setup>
defineProps({
  contact: {
    contactText: {
      required: true,
      type: String,
    },
    iconUrl: {
      type: String,
      default: "/src/assets/icons/call.svg",
    },
  },
});
</script>

<style scoped></style>
