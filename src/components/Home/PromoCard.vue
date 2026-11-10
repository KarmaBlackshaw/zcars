<script setup lang="ts">
import { site } from "virtual:content";

import { PROMO_ANCHOR } from "@/constants/promo";
import type { TPromo } from "@/types";

defineOptions({ name: "HomePromoCard" });

const { promo } = defineProps<{ promo: TPromo }>();

const validity = computed(() => formatPromoValidity(promo.starts_on, promo.ends_on));
</script>

<template>
  <div
    :id="PROMO_ANCHOR"
    class="night ink-gradient relative isolate flex h-full min-h-[26rem] scroll-mt-nav flex-col justify-between overflow-hidden rounded-xl p-5 desk:p-6"
  >
    <span class="streaks pointer-events-none absolute inset-0 opacity-60"></span>
    <div class="relative">
      <p class="font-display text-eyebrow uppercase italic text-hot">Promo</p>
      <p v-if="promo.price_label" class="mt-3 font-display text-price uppercase italic tabular-nums text-fg">{{ promo.price_label }}</p>
      <h3 class="mt-2 text-tile-title text-glow">{{ promo.title }}</h3>
      <p class="mt-3 text-small text-muted">{{ promo.text }}</p>
      <p v-if="validity" class="mt-2 text-micro text-muted">{{ validity }}</p>
    </div>
    <BaseButton variant="light" :href="site.messenger_url" class="relative mt-6 self-start">Book this promo</BaseButton>
  </div>
</template>
