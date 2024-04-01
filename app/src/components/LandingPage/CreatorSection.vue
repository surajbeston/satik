<template>
  <div class="py-8">
    <CreativeIcon />
    <h1 class="text-3xl font-inria-sans my-6 text-secondary-0 font-semibold">
      Creators
    </h1>
    <div
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
      class="grid gap-4 justify-center items-stretch py-6"
    >
      <CreatorCard
        v-for="creator in creators"
        :key="creator.id"
        :creator="creator"
      />
    </div>
  </div>
</template>

<script setup>
import CreatorCard from "../CreatorCard.vue";
import CreativeIcon from "../icons/creativeIcon.vue";
const creators = [
  {
    id: 1,
    name: "Suraj Jha",
    userName: "Get Suraj Jha",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Youtube content creator",
  },
  {
    id: 2,
    name: "Saurav Niraula",
    userName: "sauravNiraula",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Youtube content creator",
  },
  {
    id: 3,
    name: "Avinash Kumar Singh",
    userName: "avinashKumarSingh",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Youtube content creator",
  },
  {
    id: 4,
    name: "Saurav Niraula",
    userName: "sauravNiraula",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    bio: "Youtube content creator",
  },
];
</script>

<style scoped></style>
