<script setup lang="ts">
import { badgeClasses } from "@/constants/brand";
import type { TReview, TReviewSource } from "@/types";

defineOptions({ name: "HomeReviewsCard" });

const { review } = defineProps<{ review: TReview }>();

const sourceLabels: Record<TReviewSource, string> = { facebook: "Facebook", google: "Google", "in-person": "In person" };

const sourceText = computed(() => sourceLabels[review.source]);
</script>

<template>
  <figure class="flex h-full flex-col gap-4 border-t border-line pt-6">
    <HomeReviewsStars :rating="review.rating" />
    <blockquote class="whitespace-pre-line text-fg">{{ review.quote }}</blockquote>
    <figcaption class="mt-auto grid gap-1 text-small">
      <strong class="break-words">{{ review.name }}</strong>
      <span v-if="review.vehicle" :class="badgeClasses">{{ review.vehicle }}</span>
      <BaseExternalLink v-if="review.source_url" :href="review.source_url" class="text-accent-text hover:underline">{{ sourceText }}</BaseExternalLink>
    </figcaption>
  </figure>
</template>
