<template>
  <div class="flex gap-10 flex-col md:flex-row justify-between py-16 mt-6">
    <div class="w-full text-center md:text-start md:w-[400px] lg:w-[600px]">
      <div class="w-[120px] pb-8 max-md:mx-auto">
        <img class="w-full h-full" src="../assets/icons/logo.svg" alt="logo" />
      </div>
      <p class="font-semibold text-lg text-neutral-10">
        Satik helps create on-chain contracts between influencers and brands where influencers are paid for both views and sales they bring for brands, on the fly. 
      </p>
    </div>
    <div class="flex gap-10 w-full justify-center md:justify-end">
      <div>
        <h3 class="text-xl font-semibold text-secondary-0">Pages</h3>
        <ul class="space-y-2 py-4">
          <li class="text-neutral-10 hover:text-secondary-0 duration-500">
            <RouterLink to="/">Home</RouterLink>
          </li>
          <li class="text-neutral-10 hover:text-secondary-0 duration-500">
            <RouterLink to="/influencers">Influencers</RouterLink>
          </li>
          <li class="text-neutral-10 hover:text-secondary-0 duration-500">
            <RouterLink to="/brands">Brands</RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-secondary-0">Social links</h3>
        <ul class="space-y-2 py-4">
          <li
            class="text-neutral-10 hover:text-secondary-0 duration-500 underline underline-offset-4"
          >
            <RouterLink to="https://twitter.com/satik2024">Twitter</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
