<script setup lang="ts">
import { site } from "virtual:content";

import { PROMO_ANCHOR } from "@/constants/promo";
import type { TPromo } from "@/types";

defineOptions({ name: "HomePromoCard" });

const { promo } = defineProps<{ promo: TPromo }>();

const validity = computed(() => formatPromoValidity(promo.starts_on, promo.ends_on));
</script>

<template>
  <div :id="PROMO_ANCHOR" class="kit-home flex h-full scroll-mt-nav flex-col justify-between overflow-clip rounded-lg p-5 desk:p-6" data-qa="promo-card">
    <div>
      <div class="stitch inline-block rounded-md bg-electrifyingChartreuse px-3.5 py-2.5 text-coveGray" data-qa="promo-price">
        <p class="text-micro font-bold uppercase [font-stretch:115%]">Promo</p>
        <p v-if="promo.price_label" class="mt-1 font-display text-price font-black tabular-nums">{{ promo.price_label }}</p>
      </div>
      <h3 class="mt-6 text-balance">{{ promo.title }}</h3>
      <p class="mt-3 text-small">{{ promo.text }}</p>
      <p v-if="validity" class="name-line mt-3">{{ validity }}</p>
    </div>
    <BaseButton :href="site.messenger_url" class="mt-6 self-start" data-qa="promo-book">Book this promo</BaseButton>
  </div>
</template>
