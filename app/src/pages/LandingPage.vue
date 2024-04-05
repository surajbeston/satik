<template>
  <div class="relative">
    <HeroSection />
    <!-- <HowItWork /> -->
    <Features />
    <HowItWork />

    <CreatorSection />
    <BrandSection />
    <Footer />

    <!-- <InfluencerSection /> -->
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import HowItWork from "../components/LandingPage/HowItWork.vue";
import CreatorSection from "../components/LandingPage/InfluencerSection.vue";
import BrandSection from "../components/LandingPage/BrandSection.vue";
import Features from "../components/LandingPage/Features.vue";
import HeroSection from "../components/LandingPage/HeroSection.vue";
import Wrapper from "../components/Wrapper.vue";
import DividerPattern from "../components/DividerPattern.vue";
import InfluencerSection from "../components/LandingPage/InfluencerSection.vue";
</script>

<style scoped></style>
