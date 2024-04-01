<template>
  <div>
    <!-- creator card -->
    <!-- <div class="flex gap-8 bg-primary-70 rounded-lg px-6 py-2">
        <div class="overflow-hidden">
          <img
            class="w-[100px] h-[100px] rounded-full"
            src="../assets/images/creator.jpg"
            alt="creator"
          />
        </div>
        <div>
          <h2>Suraj Bahadur Jha</h2>
          <p>Contract</p>
        </div>
      </div> -->
    <div>
      <h1>FILL IN THE DETAILS</h1>
      <pre>user id{{ $route.params.id }}</pre>
      <div class="bg-primary-80 p-2 shadow-2xl rounded-xl my-8">
        <form action=" " class="border-2 border-primary-60 p-6 rounded-xl">
          <div>
            <label class="text-2xl block pb-6" for="">Add Products</label>
            <ProductDetail />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Wrapper from "../components/Wrapper.vue";
import ProductDetail from "../components/ContractPage/productDetail.vue";
</script>

<style scoped></style>
