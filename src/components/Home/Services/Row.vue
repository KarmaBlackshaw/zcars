<script setup lang="ts">
import type { TService } from "@/types";

defineOptions({ name: "HomeServicesRow" });

const { service, number } = defineProps<{ service: TService; number: number }>();

const index = computed(() => String(number).padStart(2, "0"));
</script>

<template>
  <li class="group grid gap-6 border-b border-line py-8 desk:grid-cols-12 desk:items-center desk:gap-8 desk:py-10">
    <span class="text-small font-semibold tabular-nums text-accent-text desk:col-span-1 desk:self-start desk:pt-2">{{ index }}</span>
    <div class="desk:col-span-6">
      <h3 class="text-[clamp(1.5rem,2.4vw,2rem)]">{{ service.title }}</h3>
      <p class="mt-3 max-w-[48ch] text-muted">{{ service.description }}</p>
      <ul role="list" class="mt-5 flex flex-wrap gap-2">
        <li v-for="tag in service.tags" :key="tag" class="rounded-full border border-line px-3 py-1 text-micro font-semibold text-muted">
          {{ tag }}
        </li>
      </ul>
    </div>
    <div class="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-surface desk:col-span-4 desk:col-start-9">
      <img
        v-if="service.image"
        :src="service.image.src"
        :alt="service.image.alt"
        :width="service.image.width"
        :height="service.image.height"
        loading="lazy"
        class="absolute inset-0 size-full object-cover transition-transform duration-800 ease-settle motion-safe:group-hover:scale-[1.05]"
      />
      <div v-else class="absolute inset-0 grid place-items-center bg-[radial-gradient(theme(colors.line)_1px,transparent_1px)] [background-size:14px_14px]">
        <component
          :is="service.icon"
          :size="48"
          weight="light"
          aria-hidden="true"
          class="text-accent-text transition-transform duration-800 ease-settle motion-safe:group-hover:scale-110"
        />
      </div>
    </div>
  </li>
</template>
