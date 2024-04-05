<template>
  <div>
    <div class="w-full sm:w-[90%] xl:w-[80%] mx-auto py-16">
      <div class="flex flex-col lg:flex-row gap-10 pb-8">
        <div class="w-full lg:w-1/2 h-[700px] max-md:mx-auto">
          <img
            class="h-full w-full lg:w-[90%] object-cover"
            :src="brand.profileImage ? brand.profileImage : defaultProfile"
            alt=""
          />
        </div>
        <div class="w-full lg:w-1/2">
          <h1 class="text-5xl pt-2 pb-6 font-bold text-neutral-10">
            {{ brand.name }}
          </h1>
          <div class="py-9">
            <h3
              class="border-b pb-2 border-secondaryLight-0 text-xl font-semibold text-neutral-10"
            >
              Brand Bio
            </h3>
            <p class="text-xl py-6 text-neutral-10 leading-8 font-normal">
              {{ brand.bio }}
            </p>

            <!-- <ul class="flex gap-4 flex-col py-6">
              <CreatorContact
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
              />
            </ul> -->
            <!-- <button
              @click="$router.push(`/contract/${publicKey}`)"
              class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
            >
              Initiate Contract
            </button> -->
          </div>
        </div>
      </div>

      <!-- <InfluencerStat :stat="{ number: '8.5K', description: 'Average Reach' }" /> -->
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { fetchBrandByUsername } from "../../anchor/utils";
import { ref } from "vue";
const route = useRoute();

const brand = ref({});

const defaultProfile = ref("/loading.gif");

const brandDetails = async () => {
  const brandObj = await fetchBrandByUsername(route.params.id);

  brand.value = brandObj.account;
};
brandDetails();
</script>

<style scoped></style>
