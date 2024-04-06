<template>
  <div
    class="fixed inset-0 flex justify-center items-center h-screen w-screen z-40 bg-black/60"
  >
    <div
      class="w-[300px] bg-primary-80 rounded-xl text-center p-6 text-neutral-0"
    >
      <h3 class="text-2xl font-semibold text-primary-20 pb-7">
        Are you sure ?
      </h3>
      <h3 class="text-2xl font-bold py-4">You want to send proposal.</h3>
      <div class="w-full flex gap-2 mt-8">
        <button
          @click="closeModal()"
          class="w-full border rounded-xl border-secondaryLight-30 text-secondaryLight-30 py-2"
        >
          No
        </button>
        <button
          @click="sendProposal()"
          class="w-full rounded-xl bg-secondaryLight-30 text-neutral-0 font-bold py-2"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["sendProposal", "closeModal"]);
const sendProposal = () => {
  emit("sendProposal");
};

const closeModal = () => {
  emit("closeModal");
};
</script>

<style scoped></style>
