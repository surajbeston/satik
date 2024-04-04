<template>
  <div class="flex flex-col justify-center h-[89vh]">
    <div class="flex gap-8 w-full">
      <div class="basis-full flex flex-col justify-center">
        <h1 class="text-2xl mb-10 font-bold">
          Create New CPM Contract
        </h1>
        <label class="block pb-2 text-md font-semibold" for="productName">
          Unique Contract ID</label>
        <input v-model="data.contractId"
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
        <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Content URL</label>
        <input v-model="data.contentUrl"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number" name="productName" id="productName" placeholder="https://content-url.xyz" />
      </div>
      <div class="basis-full">
        <div class="flex gap-2 justify-center">
          <div class="flex flex-col items-center">
            <label class="mb-2 font-bold">Start Date</label>
            <Calender v-model="data.startDate" inline />
          </div>
          <div class="flex flex-col items-center">
            <label class="mb-2 font-bold">End Date</label>
            <Calender v-model="data.endDate" inline />
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
          <input v-model="data.cpm"
            class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
            type="number" name="productName" id="productName" placeholder="2.68" />
        </div>
      </div>
    </div>
    <div class="mt-20 flex justify-center">
      <Button class="bg-blue-800 px-6 py-2" label="Create CPM Contract" />
    </div>
  </div>
</template>

<script setup>
import Calender from "primevue/calendar";
import Button from "primevue/button";
import { reactive } from "vue";

const data = reactive({
  contractId: "",
  initialAmount: null,
  initialAmountOnReach: null,
  contentUrl: "",
  startDate: null,
  endDate: null,
  startsOnReach: null,
  endsOnReach: null,
  cpm: null,
})


</script>

<style></style>