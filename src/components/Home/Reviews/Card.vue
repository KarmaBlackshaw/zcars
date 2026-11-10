<script setup lang="ts">
import type { TReview, TReviewSource } from "@/types";

defineOptions({ name: "HomeReviewsCard" });

const { review } = defineProps<{ review: TReview }>();

const sourceLabels: Record<TReviewSource, string> = { facebook: "Facebook", google: "Google", "in-person": "In person" };

const sourceText = computed(() => sourceLabels[review.source]);
</script>

<template>
  <BaseTile as="li" padding="md" class="flex h-full flex-col gap-4">
    <blockquote class="whitespace-pre-line">{{ review.quote }}</blockquote>
    <p class="mt-auto grid gap-1 text-small">
      <strong class="break-words font-display text-card-title uppercase italic">{{ review.name }}</strong>
      <span v-if="review.vehicle" class="text-muted">{{ review.vehicle }}</span>
      <BaseExternalLink v-if="review.source_url" :href="review.source_url" class="text-link hover:underline">{{ sourceText }}</BaseExternalLink>
    </p>
  </BaseTile>
</template>
