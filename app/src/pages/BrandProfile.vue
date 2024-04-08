<template>
  <div>
    <div class="w-full sm:w-[90%] xl:w-[80%] mx-auto py-16">
      <div class="flex flex-col lg:flex-row gap-10 pb-8">
        <div class="w-full lg:w-1/2 h-[700px] max-md:mx-auto">
          <img class="h-full w-full lg:w-[90%] object-fit"
            :src="brand.profileImage ? brand.profileImage : defaultProfile" alt="" />
        </div>
        <div class="w-full lg:w-1/2">
          <h1 class="text-5xl pt-2 pb-6 font-bold text-neutral-10">
            {{ brand.name }}
          </h1>
          <div class="py-9">
            <h3 class="border-b pb-2 border-secondaryLight-0 text-xl font-semibold text-neutral-10">
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

      <!-- proposals -->
      <div v-if="showProposals">
        <h3 v-if="proposals.length > 0"
          class="border-b pb-2 border-secondaryLight-0 text-3xl font-semibold text-neutral-10">
          Proposals
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="proposal in proposals" :key="proposal"
            class="mt-10 border-zinc-700 shadow-lg shadow-[#2c3438d0] rounded-xl border p-6">
            <div class="flex flex-col md:flex-row gap-8 pb-8">
              <div @click="
                $router.push(`/brand/${proposal.account.influencer.username}`)
                " class="w-full md:w-auto min-w-[120px]">
                <img class="w-full md:w-[200px] max-h-[300px] rounded-xl h-full"
                  :src="proposal.account.influencer.profileImage" :alt="proposal.account.influencer.name" />
              </div>
              <div class="space-y-3 w-full md:w-auto">
                <p @click="
                  $router.push(
                    `/influencer/${proposal.account.influencer.username}`
                  )
                  " class="text-2xl font-bold cursor-pointer text-secondaryLight-30 underline underline-offset-4">
                  {{ proposal.account.influencer.name }}
                </p>
                <p :class="proposal.account.accepted
                  ? 'text-green-400'
                  : 'text-red-400'
                  " class="font-bold">
                  {{ proposal.account.accepted ? "Accepted" : "Pending" }}
                </p>

                <p class="text-base font-normal text-neutral-10 line-clamp-2 min-h-[50px]">
                  {{ proposal.account.influencer.bio }}
                </p>
                <p class="text-xl font-bold text-neutral-20">
                  Message:
                  <ReadMore :text="proposal.account.message" />
                </p>

                <p class="text-xl font-medium text-neutral-20">
                  Webpage:
                  <a v-if="proposal.account.webpage" class="text-secondary-0 underline underline-offset-4 ml-2"
                    :href="proposal.account.webpage" target="_blank">Visit link</a>
                </p>
                <p class="text-xl font-medium text-neutral-20">
                  Sent date-time:
                  <span class="font-bold text-base block">{{
                    formatDate(proposal.account.datetime?.toString())
                  }}</span>
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
                          {{ product.account.totalAmount / 1000000 }}</span>
                      </p>
                      <p class="text-lg text-neutral-10">
                        Influencer Amount:<span class="font-bold ml-2">
                          {{ product.account.influencerAmount / 1000000 }}</span>
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
                  Get Proposal Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 v-if="cpmContracts.length > 0"
        class="border-b pb-2 border-secondaryLight-0 text-3xl font-semibold text-neutral-10">
        CPM Contracts
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="deal in cpmContracts" :key="deal"
          class="mt-10 border-zinc-700 shadow-lg shadow-[#2c3438d0] rounded-xl border p-6">
          <div class="flex flex-col md:flex-row gap-8">
            <div @click="
              $router.push(`/brand/${deal.account.influencer.username}`)
              " class="w-full min-w-[120px] md:w-auto">
              <img class="w-full md:w-[200px] max-h-[200px] object-cover rounded-xl h-full"
                :src="deal.account.influencer.profileImage" :alt="deal.account.influencer.name" />
            </div>
            <div class="space-y-3 w-full md:w-auto">
              <p @click="
                $router.push(`/brand/${deal.account.influencer.username}`)
                " class="text-2xl font-bold cursor-pointer text-secondaryLight-30 underline underline-offset-4">
                {{ deal.account.influencer.name }}
              </p>
              <p class="text-base text-neutral-10 line-clamp-3">
                {{ deal.account.influencer.bio }}
              </p>
              <p :class="[getStatusColor(deal.account.influencerAccepted), 'text-base line-clamp-3']">
                {{ deal.account.influencerAccepted ? "Accepted" : "Pending Approval" }}
              </p>
              <p :class="[getStatusColor(deal.account.feedScheduled), 'text-base line-clamp-3']">
                {{ deal.account.feedScheduled ? "Payment Scheduled" : "Payment Not Scheduled" }}
              </p>
              <p v-if="deal.account.initialAmount" class="text-sm font-medium text-neutral-20">
                Initial Payment: $ {{ deal.account.initialAmount / 1000000 }}
              </p>
              <p v-if="deal.account.initialAmountOnReach" class="text-sm font-medium text-neutral-20">
                Initial Payment After : {{ deal.account.initialAmountOnReach }} reach
              </p>
              <p class="text-sm font-medium text-neutral-20">
                Starts on : {{ new Date(deal.account.startsOn * 1000).toLocaleDateString() }}
              </p>
              <p class="text-sm font-medium text-neutral-20">
                Starts after : {{ deal.account.startsOnReach }} reach
              </p>
              <p class="text-sm font-medium text-neutral-20">
                Ends on : {{ new Date(deal.account.endsOn * 1000).toLocaleDateString() }}
              </p>
              <p class="text-sm font-medium text-neutral-20">
                Ends after : {{ deal.account.endsOnReach }} reach
              </p>
              <p class="text-sm font-medium text-neutral-20">
                CPM : $ {{ deal.account.cpm / 1000 }} (USDC per 1000 reach)
              </p>
              <p v-if="deal.account.influencerAccepted" class="text-blue-300 text-sm font-medium">
                Content Url : {{ deal.account.contentUrl }}
              </p>
              <p v-if="deal.account.dealEnded"
                :class="[getStatusColor(!deal.account.dealEnded), 'text-base line-clamp-3 font-bold']">
                {{ deal.account.dealEnded ? "Deal Ended" : "Deal Active" }}
              </p>
              <div class="pt-1"></div>
              <button @click="schedulePayment(deal.publicKey)"
                v-if="deal.account.influencerAccepted && !deal.account.feedScheduled"
                class="px-5 rounded-sm py-1 bg-green-700">Schedule Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import {
  fetchBrandByUsername,
  getBrandProposals,
  getBrandCPMContracts,
  getProposalProducts,
  scheduleCPMFeed,
} from "../../anchor/utils";
import { computed, onMounted, ref } from "vue";
import { useWallet } from "solana-wallets-vue";
import { toast } from "vue3-toastify";
import { formatDate } from "../helper/dateFormatter";
import ReadMore from "../components/ReadMore.vue";
const route = useRoute();
const router = useRouter();

const showProposals = ref(false);
const proposals = ref([]);
const publicKey = ref("");

const cpmContracts = ref([]);

const brand = ref({});
const isReadMore = ref(false);
const message = ref("");

const defaultProfile = ref("/loading.gif");
const wallet = useWallet();

onMounted(() => {
  setTimeout(async () => {
    const brandObj = await fetchBrandByUsername(route.params.id);
    console.log(brandObj.account.createdBy.toBase58());
    brand.value = brandObj.account;
    publicKey.value = brandObj.publicKey.toBase58();
    if (wallet.connected.value) {
      if (
        brandObj.account.createdBy.toBase58() ==
        wallet.publicKey.value.toBase58()
      ) {
        await getProposal(brandObj.account.createdBy.toBase58());
        await getCPMContracts(publicKey.value);
        showProposals.value = true;
      }
    }
  }, 1000);
});

function getStatusColor(condn) {
  if (condn) {
    return "text-green-500"
  }
  return "text-red-500"
}

async function getProposal(address) {
  const result = await getBrandProposals(address);
  console.log("this is result in fsdfs", result);
  if (result) {
    proposals.value = result
      .sort((a, b) => {
        const aDate = a.account.datetime || 0;
        const bDate = b.account.datetime || 0;
        return bDate - aDate;
      })
      .filter((proposal) => proposal.account.datetime);
  }
}

async function getCPMContracts(address) {
  const result = await getBrandCPMContracts(address);
  console.log(result);
  if (result) {
    cpmContracts.value = result
      .sort((a, b) => {
        const aDate = a.account.startsOn || 0;
        const bDate = b.account.startsOn || 0;
        return bDate - aDate;
      })
      .filter((deal) => deal.account.startsOn);
  }
}

async function getProducts(proposal) {
  toast.info("Getting Products...");
  proposal.products = await getProposalProducts(proposal.publicKey.toBase58());
}

async function schedulePayment(dealPk) {
  toast("Scheduling Payment...", {
    autoClose: 3000,
    type: 'info',
  });
  try {
    await scheduleCPMFeed(dealPk);
    toast("Payment Scheduled", {
      autoClose: 3000,
      type: 'success',
    });
    getCPMContracts(publicKey.value);
  } catch (error) {
    toast("Error occured !", {
      autoClose: 3000,
      type: 'error',
    });
  }
}


const displayMessage = computed(() => {
  if (isReadMore.value) {
    return;
  }
});
</script>

<style scoped></style>
