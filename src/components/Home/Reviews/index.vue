<script setup lang="ts">
import { home, reviews } from "virtual:content";
import { gridClasses, sectionBodyClasses, sectionClasses } from "@/constants/section";

defineOptions({ name: "HomeReviews" });

const VISIBLE_LIMIT = 3;

const linkedReviews = getLinkedReviews(reviews);
const visibleReviews = linkedReviews.slice(0, VISIBLE_LIMIT);
</script>

<template>
  <section v-if="linkedReviews.length" id="reviews" :class="sectionClasses">
    <BaseContainer>
      <BaseSectionHeading :title="home.reviews_title" />
      <ul :class="[sectionBodyClasses, gridClasses]">
        <HomeReviewsCard v-for="review in visibleReviews" :key="review.id" :review="review" class="reveal desk:col-span-4" />
      </ul>
    </BaseContainer>
  </section>
</template>
