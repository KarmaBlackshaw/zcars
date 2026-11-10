<script setup lang="ts">
import { site } from "virtual:content";

import type { TPromo } from "@/types";

defineOptions({ name: "HomePromosCard" });

const { promo } = defineProps<{ promo: TPromo }>();

const validity = computed(() => formatPromoValidity(promo.starts_on, promo.ends_on));
</script>

<template>
  <article class="grid gap-4 py-6 desk:grid-cols-12 desk:items-center desk:gap-8">
    <p v-if="promo.price_label" class="font-display text-h2 tabular-nums text-brand-highlight [font-stretch:140%] desk:col-span-3">{{ promo.price_label }}</p>
    <div class="desk:col-span-6">
      <h3 class="text-h3">{{ promo.title }}</h3>
      <p class="mt-1">{{ promo.text }}</p>
      <p v-if="validity" class="mt-1 text-micro font-semibold">{{ validity }}</p>
    </div>
    <BaseButton variant="onBrand" size="sm" :href="site.messenger_url" class="desk:col-span-3 desk:justify-self-end">Book this promo</BaseButton>
  </article>
</template>
