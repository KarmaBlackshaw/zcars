<script setup lang="ts">
import type { TReview, TReviewSource } from "@/types";

defineOptions({ name: "HomeReviewsCard" });

const { review } = defineProps<{ review: TReview }>();

const sourceLabels: Record<TReviewSource, string> = { facebook: "Facebook", google: "Google", "in-person": "In person" };

const sourceText = computed(() => sourceLabels[review.source]);
</script>

<template>
  <li class="flex h-full flex-col gap-4 rounded-lg border border-bluishWhite bg-white p-5 desk:p-7" :data-qa="`review-${review.id}`">
    <blockquote class="whitespace-pre-line">{{ review.quote }}</blockquote>
    <p class="mt-auto grid gap-1 text-small">
      <strong class="break-words font-display text-h3 font-extrabold uppercase">{{ review.name }}</strong>
      <span v-if="review.vehicle" class="text-muted">{{ review.vehicle }}</span>
      <BaseButton v-if="review.source_url" variant="text" size="sm" :href="review.source_url" class="justify-self-start">{{ sourceText }}</BaseButton>
    </p>
  </li>
</template>
