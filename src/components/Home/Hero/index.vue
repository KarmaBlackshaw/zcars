<script setup lang="ts">
import { home, site } from "virtual:content";

import { HERO_PHOTO } from "@/constants/hero";
import type { TProject } from "@/types";

defineOptions({ name: "HomeHero" });

const { project } = defineProps<{ project?: TProject }>();

const image = computed(() => ({
  src: HERO_PHOTO.src,
  srcset: HERO_PHOTO.srcset,
  sizes: HERO_PHOTO.sizes,
  alt: project?.title ?? site.name,
}));
</script>

<template>
  <SectionHero :heading="home.hero_title" :accent="home.hero_title_accent" :lead="home.hero_lead" :image="image">
    <template #eyebrow>{{ site.locality }}</template>
  </SectionHero>
</template>
