<script setup lang="ts">
import { home, reviews } from "virtual:content";
import { ruledSectionClasses } from "@/constants/section";

defineOptions({ name: "HomeReviews" });

const VISIBLE_LIMIT = 6;
const STAGGER_CAP = 3;

const linkedReviews = getLinkedReviews(reviews);
const visibleReviews = linkedReviews.slice(0, VISIBLE_LIMIT);
</script>

<template>
  <section v-if="linkedReviews.length" id="reviews" :class="ruledSectionClasses">
    <BaseContainer>
      <BaseSectionHeading :title="home.reviews_title" />
      <div class="mt-12 grid gap-8 desk:mt-14 desk:grid-cols-3">
        <div v-for="(review, index) in visibleReviews" :key="review.id" v-motion="stagger(index, STAGGER_CAP)">
          <HomeReviewsCard :review="review" />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
