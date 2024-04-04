<template>
  <div>
    <div class="w-full sm:w-[90%] xl:w-[80%] mx-auto py-16">
      <div class="flex flex-col lg:flex-row gap-10 pb-8">
        <div class="w-full lg:w-1/2 h-[700px] max-md:mx-auto">
          <img
            class="h-full w-full lg:w-[90%] object-cover"
            :src="influencer.profileImage"
            alt=""
          />
        </div>
        <div class="w-full lg:w-1/2">
          <h1 class="text-5xl pt-2 pb-6 font-bold text-neutral-10">
            {{ influencer.name }}
          </h1>
          <div class="py-9">
            <h3
              class="border-b pb-2 border-secondaryLight-0 text-xl font-semibold text-neutral-10"
            >
              Influencer Bio
            </h3>
            <p class="text-xl py-6 text-neutral-10 leading-8 font-normal">
              {{ influencer.bio }}
            </p>

            <!-- <ul class="flex gap-4 flex-col py-6">
              <CreatorContact
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
              />
            </ul> -->
            <button
              @click="$router.push(`/contract/${publicKey}`)"
              class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
            >
              Initiate Contract
            </button>
            <button
              @click="$router.push(`/cpm-contract/${publicKey}`)"
              class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
            >
              Initiate CPM Contract
            </button>
          </div>
        </div>
      </div>

      <!-- <InfluencerStat :stat="{ number: '8.5K', description: 'Average Reach' }" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InfluencerStat from "../components/influencerProfile/InfluencerStat.vue";
import InfluencerContract from "../components/influencerProfile/InfluencerContract.vue";

import { fetchInfluencerByUsername, acceptProposal } from '../../anchor/utils'

// const contacts = [
//   {
//     id: 1,
//     iconUrl: "/src/assets/icons/call.svg",
//     contactText: "+91 1234567890",
//   },
//   {
//     id: 2,
//     iconUrl: "/src/assets/icons/mail.svg",
//     contactText: "nGnFj@example.com",
//   },
//   {
//     id: 3,
//     iconUrl: "/src/assets/icons/location.svg",
//     contactText: "Mumbai, India",
//   },
// ];
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { PublicKey } from '@solana/web3.js';
import { program } from '@coral-xyz/anchor/dist/cjs/native/system';

const router = useRouter();
const route = useRoute();

const publicKey = ref("");

const influencer = ref({ name: "", username: "", bio: "", profileImage: "" });

onMounted(() => {
  console.log(route.params);
  setTimeout(async () => {
    var influencerObj = await fetchInfluencerByUsername(route.params.id);
    console.log(influencerObj.account.createdBy.toBase58());
    influencer.value = influencerObj.account;
    publicKey.value = influencerObj.publicKey.toBase58();
  }, 1000);
})

async function handleAcceptProposal() {
  await acceptProposal("CvPBxZKDPH6C8pWUNfVqA5C3qtuMKh7vYF3ssPnLXRK4");
}

</script>

<style scoped></style>
