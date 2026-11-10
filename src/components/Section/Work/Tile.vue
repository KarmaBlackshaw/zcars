<script setup lang="ts">
import { PhArrowRight, PhImages } from "@phosphor-icons/vue";
import { services } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkTile" });

const { project } = defineProps<{ project: TProject }>();

defineEmits<{ open: [] }>();

const hasMultiplePhotos = computed(() => project.gallery.length > 1);
const servicesText = computed(() => formatProjectServices(project, services));
const badge = computed(() => services.find(({ slug }) => project.services.includes(slug))?.title);
</script>

<template>
  <BaseTile as="button" padding="none" class="group flex size-full flex-col text-left" @click="$emit('open')">
    <div class="relative aspect-[4/5] w-full overflow-hidden">
      <img
        :src="project.photos[0]"
        :alt="project.title"
        loading="lazy"
        class="size-full object-cover transition-transform duration-[600ms] ease-settle motion-safe:group-hover:scale-[1.04]"
      />
      <BaseChip v-if="badge" tone="accent" class="absolute left-3 top-3">{{ badge }}</BaseChip>
      <BaseChip v-if="hasMultiplePhotos" class="absolute right-3 top-3">
        <PhImages :size="14" />
        {{ project.gallery.length }}
      </BaseChip>
    </div>
    <div class="flex flex-1 flex-col gap-1 p-4">
      <p class="font-display text-card-title uppercase italic">{{ project.vehicle }}</p>
      <p class="text-small text-muted">{{ servicesText }}</p>
      <span class="mt-auto inline-flex items-center gap-1 pt-3 text-small font-semibold text-link">
        View photos
        <PhArrowRight :size="14" />
      </span>
    </div>
  </BaseTile>
</template>
