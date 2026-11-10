<script setup lang="ts">
import { PhImages } from "@phosphor-icons/vue";
import { services } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkTile" });

const { project } = defineProps<{ project: TProject }>();

defineEmits<{ open: [] }>();

const hasMultiplePhotos = computed(() => project.gallery.length > 1);
const servicesText = computed(() => formatProjectServices(project, services));
</script>

<template>
  <BaseTile as="button" padding="none" class="group relative block size-full text-left" @click="$emit('open')">
    <img
      :src="project.photos[0]"
      :alt="project.title"
      loading="lazy"
      class="absolute inset-0 size-full object-cover transition-transform duration-[600ms] ease-settle motion-safe:group-hover:scale-[1.04]"
    />
    <div class="absolute inset-x-0 bottom-0 flex h-[45%] flex-col justify-end bg-gradient-to-t from-night/85 via-night/30 to-transparent p-4">
      <p class="text-[1.0625rem] font-[650] text-white">{{ project.vehicle }}</p>
      <p class="text-small text-muted">{{ servicesText }}</p>
    </div>
    <BaseChip v-if="hasMultiplePhotos" size="sm" class="absolute right-3 top-3">
      <PhImages :size="14" />
      {{ project.gallery.length }}
    </BaseChip>
  </BaseTile>
</template>
