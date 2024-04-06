<template>
  <div>
    <div class="w-full sm:w-[90%] xl:w-[80%] mx-auto py-16">
      <div class="flex flex-col lg:flex-row gap-10 pb-8">
        <div class="w-full lg:w-1/2 h-[700px] max-md:mx-auto">
          <img class="h-full w-full lg:w-[90%] object-cover" :src="influencer.profileImage ? influencer.profileImage : defaultProfile
            " alt="" />
        </div>
        <div class="w-full lg:w-1/2">
          <h1 class="text-5xl pt-2 pb-6 font-bold text-neutral-10">
            {{ influencer.name }}
          </h1>
          <div class="py-9">
            <h3 class="border-b pb-2 border-secondaryLight-0 text-xl font-semibold text-neutral-10">
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
            <div class="flex justify-between border-y-2 border-neutral-80 py-6">
              <p class="text-2xl font-semibold text-neutral-20">
                Followers: <span class="font-bold">{{ 1000 }}</span>
              </p>
              <button class="underline underline-offset-4 text-secondary-10 text-2xl">
                contact
              </button>
            </div>
            <div v-if="publicKey && wallet.connected">
              <button @click="initiateContract('purchase')"
                class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300">
                Initiate Contract
              </button>
              <button @click="initiateContract('cpm')"
                class="border-secondaryLight-50 border-2 w-full py-3 my-6 font-bold text-xl rounded-md text-secondaryLight-50 hover:text-secondaryLight-20 duration-300">
                Initiate CPM Contract
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showProposals">
        <h3 class="border-b pb-2 border-secondaryLight-0 text-3xl font-semibold text-neutral-10">
          Proposals
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="proposal in proposals" :key="proposal"
            class="mt-10 border-zinc-700 shadow-lg shadow-[#2c3438d0] rounded-xl border p-6">
            <div class="flex flex-col md:flex-row gap-8 pb-8">
              <div @click="
            $router.push(`/brand/${proposal.account.brand.username}`)
            " class="w-full md:w-auto">
                <img class="w-full md:w-[200px] max-h-[300px] rounded-xl h-full"
                  :src="proposal.account.brand.profileImage" :alt="proposal.account.brand.name" />
              </div>
              <div class="space-y-3 w-full md:w-auto">
                <p @click="
            $router.push(`/brand/${proposal.account.brand.username}`)
            " class="text-2xl font-bold cursor-pointer text-secondaryLight-30 underline underline-offset-4">
                  {{ proposal.account.brand.name }}
                </p>
                <p class="text-lg text-neutral-10">
                  {{ proposal.account.brand.bio }}
                </p>
                <p class="text-xl font-medium text-neutral-20">
                  Message:<span class="block ml-2">
                    {{ proposal.account.message }}</span>
                </p>
                <p class="text-xl font-medium text-neutral-20">
                  Webpage:
                  <span class="block ml-2">{{ proposal.account.website }}</span>
                </p>
                <p class="text-xl font-medium text-neutral-20">
                  Datetime Sent:
                  <span class="font-bold">{{ proposal.account.datetime }}</span>
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-3 w-full">
              <div v-if="proposal.products">
                <p class="text-2xl font-bold text-secondaryLight-20">
                  Products:
                </p>
                <template v-if="proposal.products.length > 0">
                  <div class="flex flex-wrap" v-for="product in proposal.products" :key="product">
                    <div class="border border-primary-70 p-6 shadow-lg shadow-[#2c34384f] rounded-xl my-6 space-y-3">
                      <p class="text-2xl font-semibold">
                        {{ product.account.name }}
                      </p>
                      <p class="text-lg text-neutral-20">
                        {{ product.account.description }}
                      </p>
                      <p class="text-lg text-neutral-10">
                        Total Amount:<span class="font-bold ml-2">
                          {{ product.account.totalAmount }}</span>
                      </p>
                      <p class="text-lg text-neutral-10">
                        Influencer Amount:<span class="font-bold ml-2">
                          {{ product.account.influencerAmount }}</span>
                      </p>
                    </div>
                  </div>
                </template>
                <p v-else class="text-lg text-neutral-20 py-6 font-bold">
                  No Products Found
                </p>
              </div>
              <div v-else class="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
                <button
                  class="border border-secondaryLight-50 max-w-[300px] w-full font-semibold text-xl text-secondaryLight-50 px-6 py-2 rounded-xl"
                  @click="getProducts(proposal)">
                  Get Products
                </button>
                <button v-if="!proposal.account.accepted" @click="acceptProposal(proposal)"
                  class="max-w-[300px] w-full rounded-xl bg-secondary-0 py-2 my-6 font-semibold text-xl text-neutral-0 border border-secondary-0 duration-300">
                  Accept
                </button>
              </div>
            </div>
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

import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { PublicKey } from "@solana/web3.js";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { useWallet } from "solana-wallets-vue";

import { store } from '../store';
import { toast } from "vue3-toastify";


const router = useRouter();
const route = useRoute();

const publicKey = ref("");

const influencer = ref({ name: "", username: "", bio: "", profileImage: "" });

const proposals = ref([]);

const showProposals = ref(false);

const wallet = useWallet();

onMounted(() => {
  setTimeout(async () => {
    var influencerObj = await fetchInfluencerByUsername(route.params.id);
    console.log(influencerObj.account.createdBy.toBase58());
    influencer.value = influencerObj.account;
    publicKey.value = influencerObj.publicKey.toBase58();
    if (wallet.connected.value) {
      if (
        influencerObj.account.createdBy.toBase58() ==
        wallet.publicKey.value.toBase58()
      ) {
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
  } else {
    if (store.currentUserLoaded) {
      if (store.currentUserType == "Brand") {
        if (contractType) router.push(`/contract/${publicKey.value}`);
        else router.push(`/cpm-contract/${publicKey.value}`);
      } else {
        toast("Only influencer is allowed to submit a proposal.", {
          autoClose: 3000,
          type: "error",
        });
      }
    } else {
      toast("Redirecting to create to brand profile first.", {
        autoClose: 3000,
        type: "info",
      });
      setTimeout(() => {
        router.push("/brand/register");
      }, 2000);
    }
  }
}

async function getProposals(address) {
  console.log("called");
  const result = await getInfluencerProposals(address);
  console.log("resutl", result);
  if (result) {
    proposals.value = result;
  }
}

async function getProducts(proposal) {
  toast.info("Getting Products...");
  proposal.products = await getProposalProducts(proposal.publicKey.toBase58());
  toast.success("Products Retrieved");
}

async function acceptProposal(proposal) {
  await acceptInfluencerProposal(proposal.publicKey);
  location.reload();
}
</script>

<style scoped></style>
