<script setup lang="ts">
import { home, reviews } from "virtual:content";

defineOptions({ name: "HomeReviews" });

const VISIBLE_LIMIT = 6;
const STAGGER_CAP = 3;

const visibleReviews = reviews.slice(0, VISIBLE_LIMIT);
const count = reviews.length;
const isScrollable = count >= 2;

function getSummary() {
  const averageRating = getAverageRating(reviews.map(({ rating }) => rating));

  if (averageRating) {
    return `${averageRating} average from ${count} reviews`;
  }

  return count === 1 ? "1 review" : `${count} reviews`;
}

const summary = getSummary();

const listClasses = isScrollable
  ? "-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 desk:mx-0 desk:grid desk:grid-cols-3 desk:overflow-visible desk:px-0"
  : "mt-10";
const itemClasses = isScrollable ? "w-[85%] shrink-0 snap-start desk:w-auto" : "";
const listAttrs = isScrollable ? { role: "region", "aria-label": "Customer reviews", tabindex: 0 } : {};
</script>

<template>
  <section v-if="count" id="reviews" aria-labelledby="reviews-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer>
      <BaseSectionHeading id="reviews-title" :title="home.reviews.title" :eyebrow="home.reviews.eyebrow">
        <p class="mt-3 text-muted">{{ summary }}</p>
      </BaseSectionHeading>
      <div v-bind="listAttrs" :class="listClasses">
        <div v-for="(review, index) in visibleReviews" :key="review.slug" v-motion="stagger(index, STAGGER_CAP)" :class="itemClasses">
          <HomeReviewsCard :review="review" />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
