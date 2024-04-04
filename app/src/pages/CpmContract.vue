<template>
  <div class="h-[89vh]">
    <h1 class="text-2xl pt-10 font-bold">
      Create New CPM Contract
    </h1>
    <div class="flex mt-20">
      <div class="basis-full flex flex-col justify-center">
        <label class="block pb-2 text-md font-semibold" for="productName">
          Unique Contract ID</label>
        <input v-model="produtName"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="text" name="productName" id="productName" placeholder="new unique contract id" />
        <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Initial Amount</label>
        <input v-model="produtName"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number" name="productName" id="productName" placeholder="158" />
        <label class="block pb-2 mt-4 text-md font-semibold" for="productName">Reach Goal For Initial Amount</label>
        <input v-model="produtName"
          class="w-full bg-transparent font-bold border-primary-50 shadow-[#021E32] shadow-lg border-2 rounded-2xl py-2 px-4 outline-none placeholder:text-primary-40 placeholder:font-bold"
          type="number" name="productName" id="productName" placeholder="1000000" />
      </div>
      <div class="basis-full">
        
      </div>
    </div>
  </div>
</template>

<script setup>

</script>