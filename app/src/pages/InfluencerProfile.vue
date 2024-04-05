<template>
  <div>
    <div class="w-full sm:w-[90%] xl:w-[80%] mx-auto py-16">
      <div class="flex flex-col lg:flex-row gap-10 pb-8">
        <div class="w-full lg:w-1/2 h-[700px] max-md:mx-auto">
          <img
            class="h-full w-full lg:w-[90%] object-cover"
            :src="
              influencer.profileImage ? influencer.profileImage : defaultProfile
            "
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
            <div v-if="publicKey && wallet.connected">
              <button 
                @click="initiateContract('purchase')"
                class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
              >
                Initiate Contract
              </button>
              <button
                @click="initiateContract('cpm')"
                class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
              >
                Initiate CPM Contract
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if ="showProposals">
        <h3
          class="border-b pb-2 border-secondaryLight-0 text-xl font-semibold text-neutral-10"
        >
          Proposals
        </h3>
        <div
          v-for="proposal in proposals"
          :key="proposal"
          class="flex gap-6 mt-5 border-zinc-100 border p-3"
        >
          <div class="flex flex-col gap-2">
            <p>
              Brand:
              <a
                :href="`/brand/${proposal.account.brand.username}`"
                target="_blank"
                >{{ proposal.account.brand.name }}</a
              >
            </p>
            <p>Message: {{ proposal.account.message }}</p>
            <p>Webpage: {{ proposal.account.website }}</p>
            <p>Datetime Sent: {{ proposal.account.datetime }}</p>
            <div v-if="proposal.products">
              <p>Products:</p>
              <div
                class="borber border-white-10 p-2"
                v-for="product in proposal.products"
                :key="product"
              >
                <p>Name: {{ product.account.name }}</p>
                <p>Description: {{ product.account.description }}</p>
                <p>Total Amount: {{ product.account.totalAmount }}</p>
                <p>Influencer Amount: {{ product.account.influencerAmount }}</p>
              </div>
            </div>
            <div v-else>
              <button
                class="border border-white-10"
                @click="getProducts(proposal)"
              >
                Get Products
              </button>
            </div>
            <button
              v-if="!proposal.account.accepted"
              @click="acceptProposal(proposal)"
              class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300"
            >
              Accept
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

import {
  fetchInfluencerByUsername,
  getProposalProducts,
  getInfluencerProposals,
  acceptInfluencerProposal,
} from "../../anchor/utils";

const defaultProfile = ref("/loading.gif");

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
import {toast} from 'vue3-toastify';
import { PublicKey } from "@solana/web3.js";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { useWallet } from "solana-wallets-vue";

import {store} from '../store';

const router = useRouter();
const route = useRoute();

const publicKey = ref("");

const influencer = ref({ name: "", username: "", bio: "", profileImage: "" });

const proposals = ref([]);

const showProposals = ref(false)

const wallet = useWallet();

onMounted(() => {
  setTimeout(async () => {
    var influencerObj = await fetchInfluencerByUsername(route.params.id);
    console.log(influencerObj.account.createdBy.toBase58());
    influencer.value = influencerObj.account;
    publicKey.value = influencerObj.publicKey.toBase58();
    if(wallet.connected.value){
      if (influencerObj.account.createdBy.toBase58() == wallet.publicKey.value.toBase58()) {
        getProposals(influencerObj.account.createdBy.toBase58());
        showProposals.value = true;
      }
    }
  }, 1000);
});

// async function handleAcceptProposal() {
//   await acceptProposal("CvPBxZKDPH6C8pWUNfVqA5C3qtuMKh7vYF3ssPnLXRK4");
// }

async function initiateContract(contractType) {
  if (!wallet.connected.value) {
    toast("Please connect your wallet.", { autoClose: 3000, type: "error" });
  }
  else{
    if (store.currentUserLoaded){
      if (store.currentUserType == "Brand"){
        if (contractType) router.push(`/contract/${publicKey.value}`);
        else router.push(`/cpm-contract/${publicKey.value}`);
      }
      else{
        toast("Only influencer is allowed to submit a proposal.", { autoClose: 3000, type: "error" });
      }
    }
    else{
      toast("Redirecting to create to brand profile first.", { autoClose: 3000, type: "info" });
      setTimeout(() => {
        router.push("/brand/register");
      }, 2000)
    }
  }
}

async function getProposals(address) {
  const result = await getInfluencerProposals(address);
  if (result) {
    proposals.value = result;
  }
}

async function getProducts(proposal) {
  proposal.products = await getProposalProducts(proposal.publicKey.toBase58());
}

async function acceptProposal(proposal) {
  await acceptInfluencerProposal(proposal.publicKey);
  location.reload();
}



</script>

<style scoped></style>
