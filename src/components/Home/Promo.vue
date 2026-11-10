<script setup lang="ts">
import { site } from "virtual:content";

defineOptions({ name: "HomePromo" });

const { featuredPromo: promo } = usePromos();

const validity = computed(() => formatPromoValidity(promo.value?.starts_on, promo.value?.ends_on));
</script>

<template>
  <BasePanel v-if="promo" id="promo" tone="accent">
    <div class="grid gap-6 py-16 desk:grid-cols-12 desk:items-end desk:gap-4 desk:py-24">
      <div class="desk:col-span-7">
        <p v-if="promo.price_label != null" class="text-price tabular-nums text-white">{{ promo.price_label }}</p>
      </div>
      <div class="reveal desk:col-span-5">
        <h2 class="text-white">{{ promo.title }}</h2>
        <p class="mt-4 text-lead text-white/85">{{ promo.text }}</p>
        <p v-if="validity" class="mt-3 text-micro text-white/85">{{ validity }}</p>
        <BaseButton variant="inverse" :href="site.messenger_url" class="mt-8 w-full desk:w-auto">Book this promo</BaseButton>
      </div>
    </div>
  </BasePanel>
</template>
