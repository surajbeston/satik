<template>
  <div class="max-md:mx-auto bg-primary-80 p-6 rounded-xl w-full">
    <div
      class="rounded-xl mx-auto overflow-hidden shadow-xl shadow-primary-60 mb-4 min-h-[190px]"
    >
      <img
        class="h-full w-full object-cover"
        :src="brand.profileImage"
        :alt="brand.name"
      />
    </div>
    <div class="py-2">
      <h1 class="text-2xl font-open-sans font-semibold text-neutral-0">
        {{ brand.name }}
      </h1>
      <p class="text-neutral-30 text-sm py-1 underline">
        {{ brand.username }}
      </p>
    </div>
    <p class="text-base line-clamp-3 text-neutral-10">
      {{ brand.bio }}
    </p>
    <button
      @click="$router.push(`/creator/${brand.username}`)"
      class="bg-secondary-30 py-2 rounded-xl mt-4 w-full hover:bg-secondary-40 duration-300"
    >
      View Profile
    </button>
  </div>
</template>

<script setup>
defineProps({
  brand: {
    type: {
      name: String,
      username: String,
      profileImage: String,
      bio: String,
    },
  },
});
</script>

<style scoped></style>
