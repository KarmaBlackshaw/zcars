<script setup lang="ts">
import { PhArrowRight } from "@phosphor-icons/vue";
import { projects } from "virtual:content";

import type { TService } from "@/types";

defineOptions({ name: "ServiceListRow" });

const { service, shouldLoadThumbnail } = defineProps<{ service: TService; shouldLoadThumbnail: boolean }>();

const servicePath = computed(() => getServicePath(service.slug));
const thumbnail = computed(() => getServiceShowcase(service, projects).project?.photos[0]);
</script>

<template>
  <li class="border-b border-fg/10">
    <a
      :href="servicePath"
      class="group relative flex items-start justify-between gap-4 py-6 desk:grid desk:min-h-28 desk:grid-cols-12 desk:items-center desk:gap-4"
    >
      <div class="desk:contents">
        <h3 class="text-list transition-transform duration-300 ease-settle motion-safe:group-hover:translate-x-2 desk:col-span-7">{{ service.title }}</h3>
        <div class="mt-2 desk:col-span-4 desk:mt-0 desk:pr-20">
          <p class="text-small text-muted">{{ service.summary }}</p>
          <p v-if="service.price_from != null" class="text-small font-semibold tabular-nums">From {{ formatPrice(service.price_from) }}</p>
        </div>
      </div>
      <img
        v-if="shouldLoadThumbnail && thumbnail != null"
        :src="thumbnail"
        alt=""
        loading="lazy"
        class="pointer-events-none absolute right-[4.5rem] top-1/2 hidden h-32 w-24 -translate-y-1/2 rounded-xl object-cover opacity-0 transition-[opacity,transform] duration-[250ms] ease-settle group-hover:opacity-100 motion-safe:scale-[.92] motion-safe:group-hover:scale-100 desk:block"
      />
      <div class="shrink-0 desk:col-span-1 desk:justify-self-end">
        <span
          class="grid size-10 place-items-center rounded-full ring-1 ring-fg/20 transition-[background-color,transform] duration-300 ease-settle group-hover:bg-accent group-hover:text-white motion-safe:group-hover:-rotate-45 desk:size-12"
        >
          <PhArrowRight :size="20" />
        </span>
      </div>
    </a>
  </li>
</template>
