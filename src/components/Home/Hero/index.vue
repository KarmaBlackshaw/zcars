<script setup lang="ts">
import { home } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "HomeHero" });

const { project } = defineProps<{ project?: TProject }>();
</script>

<template>
  <SectionHero :heading="home.hero_title" :accent="home.hero_title_accent" :lead="home.hero_lead" :project="project" />
</template>
