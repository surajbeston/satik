<template>
  <div>
    <Wrapper>
      <Header />
      <!-- <DividerPattern /> -->
      <HeroSection />
      <InfluencerSection />
    </Wrapper>
  </div>
</template>

<script setup>
import Header from "../components/LandingPage/Header.vue";
import HeroSection from "../components/LandingPage/HeroSection.vue";
import Wrapper from "../components/Wrapper.vue";
import DividerPattern from "../components/DividerPattern.vue";
import InfluencerSection from "../components/LandingPage/InfluencerSection.vue";
</script>

<style scoped></style>
