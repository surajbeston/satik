<template>
  <div class="relative px-6 md:px-0">
    <DividerPattern />
    <img
      class="w-[70px] h-[70px] mb-10"
      src="../../assets/icons/networking.png"
      alt="how it work"
    />
    <h1 class="font-inria-sans text-secondary-0 font-semibold text-3xl">
      How it works
    </h1>
    <div class="py-20">
      <h2 class="text-primary-10 font-semibold pb-16 text-2xl text-center">
        How Product Purchase works
      </h2>
      <ol class="block relative list-decimal md:hidden">
        <li class="py-4">
          <h4 class="text-secondary-0 font-bold text-xl">Contract</h4>
          <p class="text-neutral-0 text-base font-semibold">
            Influencer and brand come together and agree on commission per
            purchase for Influencer.
          </p>
        </li>
        <li class="py-4">
          <h4 class="text-secondary-0 font-bold text-xl">Product Page</h4>
          <p class="text-neutral-0 text-base font-semibold">
            An immutable product page is created for customer to purchase, which
            then Influencer promotes.
          </p>
        </li>
        <li class="py-4">
          <h4 class="text-secondary-0 font-bold text-xl">Purchase</h4>
          <p class="text-neutral-0 text-base font-semibold">
            Customer purchase the product and the payment is distrubuted on th
            fly.
          </p>
        </li>
      </ol>
      <img
        class="w-full hidden md:block object-cover"
        src="../../assets/icons/how1.svg"
        alt="how"
      />
    </div>
    <div class="pb-10">
      <h2 class="text-primary-10 font-semibold pb-16 text-2xl text-center">
        How CPM works
      </h2>
      <ol class="block relative list-decimal md:hidden">
        <li class="py-4">
          <h4 class="text-secondary-0 font-bold text-xl">Contract</h4>
          <p class="text-neutral-0 text-base font-semibold">
            Influencer and brand come together and agree on CPM (Cost Per Mile).
          </p>
        </li>
        <li class="py-4">
          <h4 class="text-secondary-0 font-bold text-xl">Content Upload</h4>
          <p class="text-neutral-0 text-base font-semibold">
            Influencer uploads their content which is then monitered by Satik
            on-chain programs.
          </p>
        </li>
        <li class="py-4">
          <h4 class="text-secondary-0 font-bold text-xl">Payment</h4>
          <p class="text-neutral-0 text-base font-semibold">
            Content performance is checked on regular basis by on-chain prgrams
            and influencer is paid accordingly.
          </p>
        </li>
      </ol>
      <img
        class="hidden md:block"
        src="../../assets/icons/how2.svg"
        alt="how"
      />
    </div>
  </div>
</template>

<script setup>
import DividerPattern from "../DividerPattern.vue";
</script>

<style scoped>
.curve {
  background-image: url("../../assets/icons/curve.svg");
  background-repeat: no-repeat;
  background-size: 100% 55%;
  background-position: 0% 50%;
}
ol::before {
  content: "";
  width: 0.5rem;
  height: 100%;
  position: absolute;
  top: 0;
  left: 8%;
  background: tomato;

  z-index: 1;
}
ol > li {
  position: relative;
  background: var(--primary-60);
  padding: 0.5rem 1.5rem 1rem;
  border-radius: 1.5rem;
  margin: 1rem 0rem;
  z-index: 2;
}
::marker {
  font-weight: 600;
  color: tomato;
  font-size: 1.8rem;
}
</style>
