<script setup lang="ts">
import { services } from "virtual:content";

import type { TEntry, TProject } from "@/types";

defineOptions({ name: "HomeProjectsCard" });

const { project } = defineProps<{ project: TEntry<TProject> }>();

const emit = defineEmits<{ open: [trigger: HTMLElement] }>();

const openLabel = computed(() => `${project.title}, ${project.vehicle}. Open photo`);

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
        :src="project.after"
        :alt="project.after_alt"
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
      <span v-if="project.before" class="mt-2 inline-block rounded-full border border-muted/60 px-2 py-0.5 text-micro">Before and after</span>
    </div>
  </button>
</template>
