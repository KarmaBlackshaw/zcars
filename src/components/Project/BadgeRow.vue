<script setup lang="ts">
import { services } from "virtual:content";

import { badgeClasses } from "@/constants/brand";
import type { TProject } from "@/types";

defineOptions({ name: "ProjectBadgeRow" });

const { project } = defineProps<{ project: TProject }>();

const serviceText = computed(() =>
  services
    .filter(({ slug }) => project.services.includes(slug))
    .map(({ title }, index) => (index === 0 ? title : toMidSentence(title)))
    .join(", ")
);
</script>

<template>
  <div class="grid gap-1">
    <p :class="badgeClasses">{{ project.vehicle }}</p>
    <p v-if="serviceText" class="text-small text-muted">{{ serviceText }}</p>
  </div>
</template>
