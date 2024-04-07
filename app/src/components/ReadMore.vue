<template>
  <div>
    <p class="ml-2 font-normal text-base">
      {{ displayText }}
      <span
        v-if="showToggle"
        class="text-base inline-block ml-2 cursor-pointer text-primary-10"
        @click="toggleText"
      >
        {{ isExpanded ? "Read less" : "Read more" }}
      </span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const { text } = defineProps({
  text: String,
});

const maxCharacters = 60;
const isExpanded = ref(false);

const displayText = computed(() => {
  if (isExpanded.value || text.length <= maxCharacters) {
    return text;
  } else {
    return text.slice(0, maxCharacters) + "...";
  }
});

const showToggle = computed(() => text.length > maxCharacters);

const toggleText = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
