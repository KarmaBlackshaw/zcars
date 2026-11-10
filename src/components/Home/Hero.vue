<script setup lang="ts">
import { home, site } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "HomeHero" });

const { projects } = defineProps<{ projects: TProject[] }>();

const openNow = useOpenNow();
const { activePromos } = usePromos();

const selectedPair = ref(0);

const promo = computed(() => activePromos.value[0]);
const showcase = computed(() => projects[selectedPair.value]);
const hasMultiplePairs = computed(() => projects.length > 1);
const pairThumbnails = computed(() => projects.map(({ photos, title }) => ({ src: photos[0], alt: title })));

const promoText = computed(() => {
  if (promo.value == null) {
    return "";
  }

  const title = toMidSentence(promo.value.title);

  return promo.value.price_label ? `${title}, ${promo.value.price_label}` : title;
});

const factLine = computed(() => {
  const locality = `${site.locality}.`;

  return openNow.label.value ? `${locality} ${openNow.label.value}.` : locality;
});
</script>

<template>
  <SectionHero :heading="home.hero_heading" :lead="home.hero_lead">
    <template v-if="promo" #top>
      <a href="#promo" class="mb-3 inline-block text-small text-accent-text hover:underline">Promo: {{ promoText }}</a>
    </template>
    <template #facts>
      <span class="font-semibold">{{ factLine }}</span>
    </template>
    <template v-if="showcase" #picture>
      <SectionHeroPicture :src="showcase.photos[0]" :alt="showcase.title" :project="showcase" />
      <BaseThumbnails v-if="hasMultiplePairs" v-model="selectedPair" :items="pairThumbnails" class="mt-3" />
    </template>
  </SectionHero>
</template>
