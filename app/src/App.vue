s<script setup>
import Header from "./components/Header.vue";
import Wrapper from "./components/Wrapper.vue";
</script>

<template>
  <div class="bg-primary min-h-screen text-neutral-0">
    <Wrapper>
      <Header />

      <main>
        <RouterView />
      </main>
    </Wrapper>
  </div>
</template>

<style scoped></style>
