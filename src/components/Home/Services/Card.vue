<script setup lang="ts">
import { PhArrowRight, PhHammer, PhPaintRoller, PhShieldCheck, PhSparkle, PhSprayBottle, PhSunDim, PhUmbrella, PhWrench } from "@phosphor-icons/vue";
import type { Component } from "vue";

import type { TService, TServiceIcon } from "@/types";

defineOptions({ name: "HomeServicesCard" });

const { service } = defineProps<{ service: TService }>();

const icons: Record<TServiceIcon, Component> = {
  "spray-bottle": PhSprayBottle,
  sparkle: PhSparkle,
  "shield-check": PhShieldCheck,
  hammer: PhHammer,
  "paint-roller": PhPaintRoller,
  wrench: PhWrench,
  "sun-dim": PhSunDim,
  umbrella: PhUmbrella,
};

const quoteDrawer = useQuoteDrawer();
const hasImageError = ref(false);

const iconComponent = computed(() => icons[service.icon]);
const priceLabel = computed(() => (service.price_from != null ? `From ${formatPrice(service.price_from)}` : ""));

function onImageError() {
  hasImageError.value = true;
}

function requestQuote() {
  quoteDrawer.open(service.title);
}
</script>

<template>
  <article class="grid h-full grid-cols-[5.5rem_1fr] gap-4 rounded-card bg-surface p-3 sm:flex sm:flex-col sm:p-4">
    <div class="aspect-square overflow-hidden rounded-xl bg-bg sm:aspect-[4/3]">
      <img
        v-if="service.photo && !hasImageError"
        :src="service.photo"
        :alt="service.title"
        loading="lazy"
        class="size-full object-cover"
        @error="onImageError"
      />
      <div v-else class="grid size-full place-items-center">
        <component :is="iconComponent" :size="32" weight="light" class="text-accent-text" />
      </div>
    </div>
    <div class="flex min-w-0 flex-col gap-2 sm:flex-1">
      <h3 class="text-h3">{{ service.title }}</h3>
      <p class="line-clamp-2 text-small text-muted sm:line-clamp-none">{{ service.summary }}</p>
      <p v-if="priceLabel" class="font-semibold">{{ priceLabel }}</p>
      <p v-if="service.price_note" class="text-micro text-muted">{{ service.price_note }}</p>
      <button
        type="button"
        class="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start text-small font-semibold text-accent-text hover:underline"
        @click="requestQuote"
      >
        Get a quote
        <PhArrowRight class="shrink-0" />
      </button>
    </div>
  </article>
</template>
