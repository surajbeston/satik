<template>
  <div>
    <div class="w-full sm:w-[90%] xl:w-[80%] mx-auto py-16">
      <div class="flex flex-col lg:flex-row gap-10 pb-8">
        <div class="w-full lg:w-1/2 h-[700px] max-md:mx-auto">
          <img
            class="h-full w-full lg:w-[90%] object-fit"
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

      <!-- proposals -->
      <div v-if="showProposals">
        <h3
          class="border-b pb-2 border-secondaryLight-0 text-3xl font-semibold text-neutral-10"
        >
          Proposals
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="proposal in proposals"
            :key="proposal"
            class="mt-10 border-zinc-700 shadow-lg shadow-[#2c3438d0] rounded-xl border p-6"
          >
            <div class="flex flex-col md:flex-row gap-8 pb-8">
              <div
                @click="
                  $router.push(`/brand/${proposal.account.influencer.username}`)
                "
                class="w-full md:w-auto"
              >
                <img
                  class="w-full md:w-[200px] max-h-[300px] rounded-xl h-full"
                  :src="proposal.account.influencer.profileImage"
                  :alt="proposal.account.influencer.name"
                />
              </div>
              <div class="space-y-3 w-full md:w-auto">
                <p
                  @click="
                    $router.push(
                      `/influencer/${proposal.account.influencer.username}`
                    )
                  "
                  class="text-2xl font-bold cursor-pointer text-secondaryLight-30 underline underline-offset-4"
                >
                  {{ proposal.account.influencer.name }}
                </p>
                <p class="text-lg text-neutral-10">
                  {{ proposal.account.influencer.bio }}
                </p>
                <p class="text-xl font-medium text-neutral-20">
                  Message:<span class="block ml-2">
                    {{ proposal.account.message }}</span
                  >
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
                  <div
                    class="flex flex-wrap"
                    v-for="product in proposal.products"
                    :key="product"
                  >
                    <div
                      class="border border-primary-70 p-6 shadow-lg shadow-[#2c34384f] rounded-xl my-6 space-y-3"
                    >
                      <p class="text-2xl font-semibold">
                        {{ product.account.name }}
                      </p>
                      <p class="text-lg text-neutral-20">
                        {{ product.account.description }}
                      </p>
                      <p class="text-lg text-neutral-10">
                        Total Amount:<span class="font-bold ml-2">
                          {{ product.account.totalAmount }}</span
                        >
                      </p>
                      <p class="text-lg text-neutral-10">
                        Influencer Amount:<span class="font-bold ml-2">
                          {{ product.account.influencerAmount }}</span
                        >
                      </p>
                    </div>
                  </div>
                </template>
                <p v-else class="text-lg text-neutral-20 py-6 font-bold">
                  No Products Found
                </p>
              </div>
              <div
                v-else
                class="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full"
              >
                <button
                  class="border border-secondaryLight-50 max-w-[300px] w-full font-semibold text-xl text-secondaryLight-50 px-6 py-2 rounded-xl"
                  @click="getProducts(proposal)"
                >
                  Get Proposal Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import {
  fetchBrandByUsername,
  getBrandProposals,
  getProposalProducts,
} from "../../anchor/utils";
import { onMounted, ref } from "vue";
import { useWallet } from "solana-wallets-vue";
import { toast } from "vue3-toastify";
const route = useRoute();
const showProposals = ref(false);
const proposals = ref([]);
const publicKey = ref("");

const brand = ref({});

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
        showProposals.value = true;
      }
    }
  }, 1000);
});

async function getProposal(address) {
  const result = await getBrandProposals(address);
  console.log("this is result in fsdfs", result);
  if (result) {
    proposals.value = result;
  }
}

async function getProducts(proposal) {
  toast.info("Getting Products...");
  proposal.products = await getProposalProducts(proposal.publicKey.toBase58());
}
</script>

<style scoped></style>
