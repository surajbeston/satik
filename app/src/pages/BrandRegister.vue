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
            <div v-if="!profilePicture">
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
import { ref } from "vue";
import { createClient } from "../helper/client";

const profilePicture = ref(null);
const profileHash = ref(null);

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  profilePicture.value = URL.createObjectURL(file);
  profileHash.value = await createClient(file);
};
</script>

<style scoped></style>
