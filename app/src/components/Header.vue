<template>
  <div class="flex justify-between items-center py-6">
    <div class="">
      <img
        class="w-[40px] h-[40px] rounded-full"
        src="https://picsum.photos/id/3/200/300"
        alt="logo"
      />
    </div>
    <nav>
      <ul class="flex gap-12">
        <li
          @click="navClicked(link.name)"
          :class="
            activeNav === link.name
              ? 'text-secondary-0 underline underline-offset-4 decoration-secondary-0'
              : ''
          "
          class="text-lg font-normal cursor-pointer hover:text-secondary-0 duration-300"
          v-for="link in navLinks"
          :key="link.id"
        >
          {{ link.name }}
        </li>
      </ul>
    </nav>
    <div></div>
  </div>
</template>

<script setup>
import Wrapper from "./Wrapper.vue";
import { ref } from "vue";
import { navLinks } from "../constant/index";
const activeNav = ref(navLinks[0].name);

const navClicked = (nav) => {
  activeNav.value = nav;
};
</script>

<style scoped></style>
