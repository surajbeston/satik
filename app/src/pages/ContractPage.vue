<template>
  <div class="py-16">
    <div>
      <h1 class="text-center text-4xl font-bold pb-4">FILL IN THE DETAILS</h1>

      <div
        class="bg-primary-80 p-2 shadow-2xl rounded-xl border border-primary-60 my-8"
      >
        <form
          @submit.prevent="handleSubmit"
          class="border-2 border-primary-60 p-6 rounded-xl"
        >
          <div>
            <label class="text-2xl block pb-10" for="">Add Products:</label>
            <div
              class="py-10 border-b border-primary-40"
              v-for="i in numberOfProducts"
              :key="i"
            >
              <ProductDetail />
            </div>
          </div>
          <div
            class="w-[60%] mx-auto flex font-semibold justify-center items-center pt-8"
          >
            <button
              @click="numberOfProducts++"
              class="bg-primary-0 py-2 w-full"
            >
              Add Product
            </button>
            <button
              @click="$router.push('/builder')"
              type="submit"
              class="bg-secondaryLight-20 font-semibold w-full py-2 text-center mx-auto"
            >
              Initiate Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductDetail from "../components/ContractPage/productDetail.vue";
const numberOfProducts = ref(1);

const handleSubmit = (form) => {
  console.log("called");
};
</script>

<style scoped></style>
