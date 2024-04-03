<template>
  <div class="max-md:mx-auto bg-primary-80 p-6 rounded-xl">
    <div class="rounded-full w-[200px] mx-auto h-[200px] overflow-hidden">
      <img
        class="h-full object-cover"
        :src="creator.profileImage"
        :alt="creator.name"
      />
    </div>
    <div class="py-2">
      <h1 class="text-2xl font-open-sans font-semibold text-neutral-0">
        {{ creator.name }}
      </h1>
      <p class="text-neutral-30 text-sm py-1 underline">
        {{ creator.username }}
      </p>
    </div>
    <p class="text-base line-clamp-3 text-neutral-10">
      {{ creator.bio }}
    </p>
    <button
      @click="$router.push(`/creator/${creator.username}`)"
      class="bg-secondary-30 py-2 rounded-xl mt-4 w-full hover:bg-secondary-40 duration-300"
    >
      View Profile
    </button>
  </div>
</template>

<script setup>
defineProps({
  creator: {
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
