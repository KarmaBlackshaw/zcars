<script setup lang="ts">
import type { TPromo } from "@/types";

defineOptions({ name: "HomePromosCard" });

const { promo, isFeatured = false } = defineProps<{
  promo: TPromo & { serviceTitle?: string };
  isFeatured?: boolean;
}>();

const quoteService = useQuoteService();
const hasImageError = ref(false);

const ctaLabel = computed(() => `Get this promo: ${promo.title}`);
const href = computed(() => (promo.serviceTitle == null ? "#quote" : undefined));
const validity = computed(() => formatPromoValidity(promo.starts_on, promo.ends_on));
const hasPhoto = computed(() => promo.photo != null && !hasImageError.value);

const articleClass = computed(() =>
  isFeatured
    ? "grid overflow-hidden rounded-card border border-line bg-surface desk:grid-cols-12"
    : "flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface"
);
const mediaClass = computed(() => (isFeatured ? "flex items-center justify-center bg-bunker p-4 sm:p-6 desk:col-span-5" : "aspect-[4/3] bg-bg"));
const imageClass = computed(() => (isFeatured ? "max-h-[640px] w-auto rounded-lg object-contain" : "size-full object-cover"));

const bodyClass = computed(() => {
  if (!isFeatured) {
    return "flex flex-1 flex-col gap-3 p-5 sm:p-6";
  }

  return ["flex flex-col justify-center gap-4 p-6 sm:p-10", hasPhoto.value ? "desk:col-span-7 desk:p-14" : "desk:col-span-12"];
});
const priceClass = computed(() => (isFeatured ? "text-h2 font-bold" : "text-3xl font-bold"));
const titleClass = computed(() => (isFeatured ? "text-2xl font-semibold tracking-heading desk:text-3xl" : "text-h3"));
const textClass = computed(() => (isFeatured ? "max-w-[52ch] text-lead text-muted" : "text-small text-muted"));

function onImageError() {
  hasImageError.value = true;
}

function requestPromo() {
  if (promo.serviceTitle != null) {
    quoteService.select(promo.serviceTitle);
    quoteService.jumpToField();
  }
}
</script>

<template>
  <article :class="articleClass">
    <div v-if="hasPhoto" :class="mediaClass">
      <img :src="promo.photo" :alt="promo.title" loading="lazy" :class="imageClass" @error="onImageError" />
    </div>
    <div :class="bodyClass">
      <p v-if="promo.price_label" :class="['tabular-nums tracking-heading text-accent-text', priceClass]">{{ promo.price_label }}</p>
      <h3 :class="titleClass">{{ promo.title }}</h3>
      <p :class="textClass">{{ promo.text }}</p>
      <p v-if="validity" class="text-micro font-semibold text-muted">{{ validity }}</p>
      <BaseButton
        :href="href"
        :size="isFeatured ? 'md' : 'sm'"
        :aria-label="ctaLabel"
        :class="['self-start', isFeatured ? 'mt-4' : 'mt-auto']"
        @click="requestPromo"
      >
        Get this promo
      </BaseButton>
    </div>
  </article>
</template>
