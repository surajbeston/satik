<template>
  <div class="py-12">
    <h1 class="text-4xl text-center font-bold uppercase text-secondaryLight-0">
      Create Brand Account
    </h1>
    <div
      class="flex justify-between flex-col lg:flex-row py-12 bg-primary-70 border-2 border-primary-60 p-2 rounded-xl my-10"
    >
      <form
        class="rounded-xl lg:w-1/2 order-2 lg:order-1 mx-auto w-full h-full p-6 border-2 border-primary-40"
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
            class="bg-transparent border-[3px] py-2 indent-4 rounded-xl outline-none w-full my-3 border-primary-30 placeholder:text-primary-30 font-semibold"
            cols="30"
            rows="5"
            type="text"
            placeholder="Description"
            id="description"
            name="description"
          />
        </div>
        <button
          class="bg-secondaryLight-20 w-full py-2 rounded-xl hover:bg-secondaryLight-0 duration-300 text-xl font-bold border-none mt-8"
        >
          Create
        </button>
      </form>
      <div class="order-1">
        <img
          class="mx-auto"
          src="../assets/images/brand.png"
          alt="create icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { createClient } from "../helper/client";

import { createInfluencerAccount, fetchAllInfluencers } from "../../anchor/utils";

import { toast } from "vue3-toastify";

import { useWallet } from "solana-wallets-vue";

const profilePicture = ref(null);
const profileHash = ref(null);

var profileImageURL = "";

const name = ref("");
const username = ref("");
const bio = ref("");

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
        bio.value
      );
      toast("Profile Created", { autoClose: 2000 });
      location.href = "/influencer/" + username.value;
    } catch (error) {
      console.log(error)
      toast("Account creation failed. Try changing username.", {
        autoClose: 2000,
        type: "error",
      });
      username.value = "";
    }
    sendingImage.value = false;
  }
  else{
    toast("Sending profile picture...", { autoClose: 2000, type: 'loading' });
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
    console.log("here all");
    const influencers = await fetchAllInfluencers();
    console.log(influencers);
    const {publicKey } = useWallet();

    // console.log(publicKey.value.toBase58())

    for (var influencer of influencers) {
      console.log(influencer.account.createdBy.toBase58())
      console.log (publicKey.value.toBase58())
      if (influencer.account.createdBy.toBase58() == publicKey.value.toBase58()) {
        console.log("inside")
        location.href = "/influencer/" + influencer.account.value;
      }
      console.log ()
    }
  }, 1000);
  
  
})
</script>

<style scoped></style>
