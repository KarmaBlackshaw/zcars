<script setup lang="ts">
import { PhStar } from "@phosphor-icons/vue";

defineOptions({ name: "HomeReviewsStars" });

const { rating } = defineProps<{ rating: number }>();

const stars = [1, 2, 3, 4, 5];
const label = computed(() => `Rated ${rating} out of 5`);

function starWeight(index: number): "fill" | "regular" {
  return index < rating ? "fill" : "regular";
}

function starClass(index: number) {
  return index < rating ? "text-accent-text" : "text-muted";
}
</script>

<template>
  <span role="img" :aria-label="label" class="inline-flex gap-0.5">
    <PhStar v-for="star in stars" :key="star" aria-hidden="true" :size="18" :weight="starWeight(star - 1)" :class="starClass(star - 1)" />
  </span>
</template>
