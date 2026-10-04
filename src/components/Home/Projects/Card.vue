<script setup lang="ts">
import { PhImages } from "@phosphor-icons/vue";
import { services } from "virtual:content";

import type { TEntry, TProject } from "@/types";

defineOptions({ name: "HomeProjectsCard" });

const { project } = defineProps<{ project: TEntry<TProject> }>();

const emit = defineEmits<{ open: [trigger: HTMLElement] }>();

const hasMultiplePhotos = computed(() => project.photos.length > 1);
const photoCountLabel = computed(() => `${project.photos.length} photos`);
const openLabel = computed(() => `${project.title}, ${project.vehicle}. ${hasMultiplePhotos.value ? "Open photos" : "Open photo"}`);

const serviceTitles = computed(() => services.filter((service) => project.services.includes(service.slug)).map((service) => service.title));

function onClick(event: MouseEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    emit("open", event.currentTarget);
  }
}
</script>

<template>
  <button type="button" aria-haspopup="dialog" :aria-label="openLabel" class="group block w-full scroll-mt-nav text-left" @click="onClick">
    <div class="aspect-square overflow-hidden rounded-card bg-surface sm:aspect-[4/3]">
      <img
        :src="project.photos[0].image"
        :alt="project.photos[0].alt"
        loading="lazy"
        class="size-full object-cover transition-transform duration-800 ease-settle motion-safe:group-hover:scale-[1.03]"
      />
    </div>
    <div class="mt-3">
      <p class="font-semibold">{{ project.title }}</p>
      <p class="text-small text-muted">{{ project.vehicle }}</p>
      <ul v-if="serviceTitles.length" class="mt-2 flex flex-wrap gap-1.5">
        <li v-for="title in serviceTitles" :key="title" class="rounded-full bg-surface px-2 py-0.5 text-micro text-muted">{{ title }}</li>
      </ul>
      <span v-if="hasMultiplePhotos" class="mt-2 inline-flex items-center gap-1 text-micro text-muted">
        <PhImages :size="14" aria-hidden="true" />
        {{ photoCountLabel }}
      </span>
    </div>
  </button>
</template>
