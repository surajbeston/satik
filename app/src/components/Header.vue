<template>
  <div class="flex justify-between items-center py-6">
    <div class="">
      <RouterLink to="/">
        <img
          class="w-[40px] h-[40px] rounded-full"
          src="https://picsum.photos/id/3/200/300"
          alt="logo"
        />
      </RouterLink>
    </div>
    <nav>
      <ul class="flex gap-12">
        <li
          class="text-lg font-normal cursor-pointer hover:text-secondary-0 duration-300"
          v-for="link in navLinks"
          :key="link.id"
        >
          <RouterLink
            activeClass="text-secondary-0 underline underline-offset-4 decoration-secondary-0"
            :to="link.path"
          >
            {{ link.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div></div>
  </div>
</template>

<script setup>
import { navLinks } from "../constant/index";
</script>

<style scoped></style>
