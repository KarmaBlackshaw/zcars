<script setup lang="ts">
import { home, site } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "HomeHero" });

const { project } = defineProps<{ project?: TProject }>();

const image = computed(() => (project == null ? undefined : { src: project.photos[0], alt: project.title }));
</script>

<template>
  <SectionHero :heading="home.hero_title" :accent="home.hero_title_accent" :lead="home.hero_lead" :image="image">
    <template #eyebrow>{{ site.locality }}</template>
  </SectionHero>
</template>
