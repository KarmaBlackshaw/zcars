<script setup lang="ts">
import { PhImages } from "@phosphor-icons/vue";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkCard" });

const { project } = defineProps<{ project: TProject }>();

const emit = defineEmits<{ open: [trigger: HTMLElement] }>();

const hasMultiplePhotos = computed(() => project.gallery.length > 1);
const photoCountLabel = computed(() => `${project.gallery.length} photos`);
const openLabel = computed(() => `${project.title}, ${project.vehicle}. ${hasMultiplePhotos.value ? "Open photos" : "Open photo"}`);

function onClick(event: MouseEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    emit("open", event.currentTarget);
  }
}
</script>

<template>
  <button type="button" aria-haspopup="dialog" :aria-label="openLabel" class="group block w-full scroll-mt-nav text-left" @click="onClick">
    <div class="aspect-[3/4] overflow-hidden rounded-none bg-surface">
      <img
        :src="project.photos[0]"
        :alt="project.title"
        loading="lazy"
        class="size-full object-cover transition-transform duration-800 ease-settle motion-safe:group-hover:scale-[1.03]"
      />
    </div>
    <ProjectBadgeRow :project="project" class="mt-3" />
    <span v-if="hasMultiplePhotos" class="mt-2 inline-flex items-center gap-1 text-micro text-muted">
      <PhImages :size="14" aria-hidden="true" />
      {{ photoCountLabel }}
    </span>
  </button>
</template>
