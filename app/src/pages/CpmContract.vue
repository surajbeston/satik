<template>
  <div class="flex flex-col justify-center h-[89vh]">
    <div class="flex gap-8 w-full">
      <div class="basis-full flex flex-col justify-center">
        <h1 class="text-2xl mb-10 font-bold">
          Create New CPM Contract
        </h1>
        <label class="block pb-2 text-md font-semibold" for="productName">
          Unique Contract ID</label>
        <input v-model="data.uniqueId"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text" name="productName" id="productName" placeholder="new unique contract id" />
        <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Initial Amount (Optional)</label>
        <input v-model="data.initialAmount"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number" name="productName" id="productName" placeholder="158" />
        <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Content Reach For Initial Amount
          (Optional)</label>
        <input v-model="data.initialAmountOnReach"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number" name="productName" id="productName" placeholder="1000000" />
        <!-- <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Content URL</label>
        <input v-model="data.contentUrl"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text" name="productName" id="productName" placeholder="https://content-url.xyz" /> -->
      </div>
      <div class="basis-full">
        <div class="flex gap-2 justify-center">
          <div class="flex flex-col items-center">
            <label class="mb-2 font-bold">Start Date</label>
            <Calender v-model="data.startsOn" inline />
          </div>
          <div class="flex flex-col items-center">
            <label class="mb-2 font-bold">End Date</label>
            <Calender v-model="data.endsOn" inline />
          </div>
        </div>
        <div class="flex gap-2 mt-10 mx-4">
          <div class="grow">
            <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Starts On Content Reach</label>
            <input v-model="data.startsOnReach"
              class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
              type="number" name="productName" id="productName" placeholder="1000" />
          </div>
          <div class="grow">
            <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Ends On Content Reach</label>
            <input v-model="data.endsOnReach"
              class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
              type="number" name="productName" id="productName" placeholder="1000000" />
          </div>
        </div>
        <div class="mx-4">
          <label class="block pb-2 mt-4 text-md font-semibold" for="productName">CPM (USDC per 1000 Reach)</label>
          <input :v-model="data.cpm" @input="onCPMChanged"
            class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
            type="number" name="productName" id="productName" placeholder="2.68" />
        </div>
      </div>
    </div>
    <div class="mt-20 flex justify-center">
      <Button @click="submitted" class="bg-blue-800 px-6 py-2" label="Create CPM Contract" />
    </div>
  </div>
</template>

<script setup>
import Calender from "primevue/calendar";
import Button from "primevue/button";
import { PublicKey } from "@solana/web3.js";
import { reactive, ref } from "vue";
import { createCPMContract } from "../../anchor/utils";
import { store } from "../store.js";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

let route = useRoute();
let router = useRouter();

const data = reactive({
  uniqueId: "",
  initialAmount: null,
  initialAmountOnReach: null,
  startsOn: null,
  endsOn: null,
  startsOnReach: null,
  endsOnReach: null,
  cpm: 1,
})

function onCPMChanged(event) {
  let value = event.target.value;
  if (value != "") {
    let splitted = value.split(".");
    if (splitted.length > 1 && splitted[1].split("").length > 2) {
      value = Math.trunc(value * 100) / 100;
      event.target.value = value;
    }
  }
  data.cpm = value;
}

async function submitted() {
  let brand = store.currentUser;

  if (!(data.uniqueId && data.endsOn && data.endsOnReach && data.startsOn && data.startsOnReach && data.cpm)) {
    toast("Please fill all required fields", {
      autoClose: 3000,
      type: "error",
    });
    return;
  }

  toast("Creating CPM Contract...", {
    autoClose: 3000,
    type: "info",
  });

  try {
    await createCPMContract(
      new PublicKey(route.params.id),
      brand.publicKey,
      data,
    );
    toast("CPM contract created", {
      autoClose: 3000,
      type: "info",
    });
    setTimeout(() => {
      router.back();
    }, 1000);
  } catch (error) {
    toast("Error occured!", {
      autoClose: 3000,
      type: "error",
    });
  }
}


</script>

<style></style>