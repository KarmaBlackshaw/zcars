<script setup lang="ts">
import { PhHammer, PhPaintRoller, PhShieldCheck, PhSparkle, PhSprayBottle, PhSunDim, PhUmbrella, PhWrench } from "@phosphor-icons/vue";
import type { Component } from "vue";

import type { TEntry, TService, TServiceIcon } from "@/types";

defineOptions({ name: "HomeServicesCard" });

const { service } = defineProps<{ service: TEntry<TService> }>();

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

const quoteService = useQuoteService();
const hasImageError = ref(false);

const cardId = computed(() => `service-${service.slug}`);
const iconComponent = computed(() => icons[service.icon]);
const quoteLabel = computed(() => `Get a quote for ${service.title}`);
const priceLabel = computed(() => (service.price_from != null ? `From ${formatPrice(service.price_from)}` : ""));

function onImageError() {
  hasImageError.value = true;
}

function requestQuote() {
  quoteService.select(service.title);
  quoteService.jumpToField();
}
</script>

<template>
  <article
    :id="cardId"
    class="grid h-full scroll-mt-nav grid-cols-[5.5rem_1fr] gap-4 rounded-card border border-line bg-surface p-4 sm:flex sm:flex-col sm:p-5"
  >
    <div class="aspect-square overflow-hidden rounded-xl bg-bg sm:aspect-[4/3]">
      <img
        v-if="service.photo && !hasImageError"
        :src="service.photo.image"
        :alt="service.photo.alt"
        loading="lazy"
        class="size-full object-cover"
        @error="onImageError"
      />
      <div v-else class="grid size-full place-items-center">
        <component :is="iconComponent" :size="32" weight="light" aria-hidden="true" class="text-accent-text" />
      </div>
    </div>
    <div class="flex min-w-0 flex-col gap-2 sm:flex-1">
      <h3 class="text-h3">{{ service.title }}</h3>
      <p class="line-clamp-2 text-small text-muted sm:line-clamp-none">{{ service.summary }}</p>
      <p v-if="priceLabel" class="font-semibold">{{ priceLabel }}</p>
      <p v-else class="text-muted">Ask for a quote</p>
      <p v-if="service.price_note" class="text-micro text-muted">{{ service.price_note }}</p>
      <BaseButton variant="ghost" size="sm" :aria-label="quoteLabel" class="mt-auto self-start" @click="requestQuote">Get a quote</BaseButton>
    </div>
  </article>
</template>
