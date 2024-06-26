<template>
  <div v-show="showInfluencer" class="py-12">
    <h1 class="text-4xl text-center font-bold uppercase text-secondaryLight-0">
      Create influencer Account
    </h1>
    <div
      class="flex justify-between flex-col lg:flex-row py-12 bg-primary-70 border-2 border-primary-60 p-2 rounded-xl my-10"
    >
      <form
        class="rounded-xl lg:w-1/2 order-2 lg:order-1 mx-auto w-full h-full p-6 border-2 border-primary-40"
        @submit.prevent="createInfluencer"
      >
        <div>
          <label class="block font-semibold text-xl" for="Profile"
            >Profile Picture:</label
          >
          <div
            class="w-full flex justify-center items-center h-[200px] cursor-pointer border-2 border-primary-30 rounded-xl my-3 relative"
          >
            <div class="w-full h-full" v-if="!profilePicture">
              <img
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-65"
                src="../assets/icons/plus.svg"
                alt="add"
              />
              <input
                @change="handleFileChange"
                class="w-full h-full opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
              />
            </div>
            <div v-else class="w-full h-full relative">
              <img
                @click="profilePicture = null"
                class="absolute right-3 top-3 w-6 h-6"
                src="../assets/icons/cross.svg"
                alt="close"
              />
              <img
                class="object-contain h-full w-full"
                :src="profilePicture"
                alt=""
              />
            </div>
          </div>
        </div>
        <div>
          <label class="block font-semibold text-xl" for="name">Name:</label>
          <input
            v-model="name"
            class="bg-transparent border-[3px] py-2 indent-4 rounded-xl outline-none w-full my-3 border-primary-30 placeholder:text-primary-30 font-semibold"
            type="text"
            placeholder="Name"
            id="name"
            name="name"
          />
        </div>
        <div>
          <label class="block font-semibold text-xl" for="userName"
            >Username:</label
          >
          <input
            v-model="username"
            type="text"
            class="bg-transparent border-[3px] py-2 indent-4 rounded-xl outline-none w-full my-3 border-primary-30 placeholder:text-primary-30 font-semibold"
            placeholder="username"
            id="userName"
            name="userName"
          />
        </div>
        <div>
          <label class="block font-semibold text-xl" for="description"
            >Bio:</label
          >
          <textarea
            v-model="bio"
            class="bg-transparent border-[3px] py-2 indent-4 rounded-xl outline-none w-full my-3 border-primary-30 placeholder:text-primary-30 font-semibold"
            cols="30"
            rows="5"
            type="text"
            placeholder="Description"
            id="description"
            name="description"
          />
        </div>
        <div>
          <label class="block font-semibold text-xl" for="followers"
            >Total Followers:</label
          >
          <input
            v-model="totalFollowers"
            class="w-full bg-transparent border-primary-50 font-bold shadow-lg border-2 rounded-2xl py-2 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold mt-3"
            type="number"
            name="followers"
            id="followers"
            placeholder=" eg: 1000"
          />
        </div>
        <div class="mt-8">
          <label class="block font-semibold text-xl" for="social-link"
            >Primary social media:</label
          >
          <input
            v-model="socialLink"
            class="w-full bg-transparent border-primary-50 font-bold shadow-lg border-2 rounded-2xl py-2 px-6 outline-none placeholder:text-primary-40 placeholder:font-bold mt-3"
            type="text"
            name="social-link"
            id="social-link"
            placeholder="social link"
          />
        </div>
        <button
          class="disabled:opacity-75 bg-secondaryLight-20 w-full py-2 rounded-xl duration-300 text-xl font-bold border-none mt-8"
          :class="{
            'bg-secondary-40': sendingImage,
            'hover:bg-secondaryLight-0': !sendingImage,
          }"
        >
          Create
        </button>
      </form>
      <div class="order-1">
        <img
          class="mx-auto"
          src="../assets/images/create.png"
          alt="create icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { createClient } from "../helper/client";

import {
  createInfluencerAccount,
  fetchAllBrands,
  fetchAllInfluencers,
} from "../../anchor/utils";

import { toast } from "vue3-toastify";

import { useWallet } from "solana-wallets-vue";

const profilePicture = ref(null);
const profileHash = ref(null);

var profileImageURL = "";

const name = ref("");
const username = ref("");
const bio = ref("");
const totalFollowers = ref(0);
const socialLink = ref("");

const showInfluencer = ref(false);

const wallet = useWallet();

// const { wallet, influencers };

const sendingImage = ref(false);

async function createInfluencer() {
  if (!sendingImage.value) {
    if (!bio.value || !username.value || !name.value || !profileImageURL) {
      toast("Bio, Username, Name and Profile Picture are required", {
        autoClose: 2000,
        type: "error",
      });
      return;
    }
    sendingImage.value = true;
    toast("Creating Profile", { autoClose: 2000 });
    try {
      await createInfluencerAccount(
        username.value,
        name.value,
        profileImageURL,
        bio.value,
        totalFollowers.value,
        socialLink.value
      );
      toast("Profile Created", { autoClose: 2000 });
      location.href = "/influencer/" + username.value;
    } catch (error) {
      console.log(error);
      toast("Account creation failed. Try changing username.", {
        autoClose: 2000,
        type: "error",
      });
      username.value = "";
    }
    sendingImage.value = false;
  } else {
    toast("Sending profile picture...", { autoClose: 2000, type: "loading" });
  }
}

const handleFileChange = async (event) => {
  sendingImage.value = true;
  toast("Uploading profile picture...", { autoClose: 2000 });
  try {
    const file = event.target.files[0];
    profilePicture.value = URL.createObjectURL(file);
    profileHash.value = await createClient(file);
  } catch {
    console.log(error);
    toast("Something went wrong while uploading profile picture", {
      autoClose: 3000,
      type: "error",
    });
  }
  toast("Profile picture uploaded", { autoClose: 2000, type: "success" });

  profileImageURL = `https://${profileHash.value}.ipfs.w3s.link`;

  sendingImage.value = false;
};

onMounted(async () => {
  setTimeout(async () => {
    const influencers = await fetchAllInfluencers();
    const { publicKey } = useWallet();

    // console.log(publicKey.value.toBase58())
    if (publicKey.value){
      for (var influencer of influencers) {
        console.log(influencer.account.createdBy.toBase58());
        console.log(publicKey.value.toBase58());
        if (
          influencer.account.createdBy.toBase58() == publicKey.value.toBase58()
        ) {
          console.log("inside");
          location.href = "/influencer/" + influencer.account.username;
        }
        console.log();
      }

      const brands = await fetchAllBrands();

      for (var brand of brands) {
        if (brand.account.createdBy.toBase58() == publicKey.value.toBase58()) {
          location.href = "/brand/" + brand.account.username;
        }
      }
      showInfluencer.value = true;
    }
    else{
      toast("Please connect your wallet to continue", {autoClose: 3000, type: 'error'})
    }
  }, 1000);
});
</script>

<style scoped></style>
