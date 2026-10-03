<script setup lang="ts">
import type { TEntry, TReview, TReviewSource } from "@/types";

defineOptions({ name: "HomeReviewsCard" });

const { review } = defineProps<{ review: TEntry<TReview> }>();

const sourceLabels: Record<TReviewSource, string> = { facebook: "on Facebook", google: "on Google", "in-person": "in person" };

const sourceText = computed(() => sourceLabels[review.source]);
</script>

<template>
  <figure class="flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-5">
    <HomeReviewsStars :rating="review.rating" />
    <blockquote class="whitespace-pre-line text-fg">{{ review.quote }}</blockquote>
    <figcaption class="mt-auto text-small">
      <strong class="break-words">{{ review.name }}</strong>
      <span v-if="review.vehicle" class="text-muted">, {{ review.vehicle }}</span>
      <span class="text-muted"
        >, <BaseExternalLink v-if="review.source_url" :href="review.source_url" class="underline underline-offset-2">{{ sourceText }}</BaseExternalLink
        ><template v-else>{{ sourceText }}</template></span
      >
    </figcaption>
  </figure>
</template>
