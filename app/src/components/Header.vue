<template>
  <div class="flex justify-between items-center">
    <div class="">
      <RouterLink to="/">
        <img
          class="w-[100px] h-[100px] rounded-full"
          src="../assets/icons/logo.svg"
          alt="logo"
        />
      </RouterLink>
    </div>
    <nav
      :class="{ '!translate-x-0': showNav }"
      class="max-lg:fixed right-0 top-0 max-lg:p-6 max-lg:h-screen w-[60vw] sm:w-[40vw] !min-w-[120px] duration-500 z-20 max-lg:bg-primary-70 lg:block max-lg:translate-x-full"
    >
      <img
        @click="showNav = !showNav"
        class="w-4 h-4 cursor-pointer lg:hidden"
        src="../assets/icons/cross.svg"
        alt="close"
      />
      <ul class="flex gap-12 flex-col justify-center lg:flex-row py-8">
        <li class="sm:hidden">
          <wallet-multi-button dark></wallet-multi-button>
        </li>
        <li
          class="text-xl font-normal cursor-pointer font-open-sans tracking-wider hover:text-secondary-0 duration-300"
          v-for="link in navLinks"
          :key="link.id"
        >
          <RouterLink
            @click="showNav = false"
            activeClass="text-secondary-0 underline underline-offset-4  decoration-secondary-0"
            :to="link.path"
          >
            {{ link.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="flex items-center justify-between gap-2 sm:gap-6">
      <div
        class="h-[48px] flex flex-col justify-center rounded-md bg-primary-60 p-2 hover:cursor-pointer"
        v-if="showProfile"
      >
        <div @click="goToProfile" class="h-[30px] flex flex-row">
          <img
            class="h-[30px] w-[30px] rounded-full"
            :src="profile.profileImage"
          />
          <div class="flex flex-col justify-center ml-2">
            <p class="text-sm font-medium">
              {{ profile.name }} ({{ profileType }})
            </p>
          </div>
        </div>
      </div>
      <div class="hidden sm:block">
        <wallet-multi-button dark></wallet-multi-button>
      </div>
      <div @click="showNav = !showNav" class="cursor-pointer lg:hidden">
        <span class="h-1 w-8 sm:w-12 block bg-secondaryLight-30"></span
        ><span class="h-1 w-8 sm:w-12 block bg-secondaryLight-30 my-3"></span
        ><span class="h-1 w-8 sm:w-12 block bg-secondaryLight-30"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { navLinks } from "../constant/index";
import { WalletMultiButton } from "solana-wallets-vue";
import { onMounted, ref, watch } from "vue";
import { useWallet } from "solana-wallets-vue";
import {toast} from 'vue3-toastify';

import { getCurrentUser } from "../../anchor/utils";

import {store} from '../store';

const wallet = useWallet();

const showNav = ref(false);

const showProfile = ref(false);
const profileType = ref("");
const profile = ref(null);

var walletLoaded = false;

onMounted(async () => {
  setTimeout(async () => {
    walletLoaded = true;
    if (wallet.connected.value) {
      const result = await getCurrentUser();
      console.log("this is result", result);
      if (result) {
        const [useType, currentUser] = result;
        store.currentUserLoaded = true;
        store.currentUserType = useType;
        store.currentUser = currentUser;
        showProfile.value = true;
        profileType.value = useType;
        profile.value = currentUser.account;
        console.log("Current User: ", currentUser);
      }
    }
  }, 1000);
});

function goToProfile() {
  if (profileType.value == "Influencer") {
    location.href = "/influencer/" + profile.value.username;
  } else {
    location.href = "/brand/" + profile.value.username;
  }
}

watch(
  () => wallet.connected.value,
  (newValue, oldValue) => {
    if (walletLoaded) {
      if (!oldValue && newValue) {
        toast("Reloading page...", { autoClose: 2000, type: "success" });
        setTimeout(() => {
          location.reload();
        }, 1000);
        
      }
    }
  }
);
</script>

<style scoped></style>
