<script setup lang="ts">
import { services } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkTags" });

const { project } = defineProps<{ project: TProject }>();

const projectServices = computed(() => getProjectServices(project, services));
</script>

<template>
  <ul class="flex flex-wrap gap-x-4 gap-y-1.5">
    <li v-for="service in projectServices" :key="service.slug" class="flex items-center gap-2 text-small text-muted">
      <span class="grid h-5 min-w-6 place-items-center rounded bg-blueGrotto px-1 font-display text-sm font-black tabular-nums leading-none text-white">
        {{ formatServiceNumber(service.position) }}
      </span>
      {{ service.title }}
    </li>
  </ul>
</template>
