<script setup lang="ts">
import { PhCaretRight } from "@phosphor-icons/vue";

import type { TService } from "@/types";

defineOptions({ name: "ServiceRow" });

const { service } = defineProps<{ service: TService }>();

const servicePath = computed(() => getServicePath(service.slug));
</script>

<template>
  <a :href="servicePath" class="group flex min-h-11 items-start justify-between gap-4 border-b border-line py-5">
    <div>
      <h3 class="text-h3 transition-colors group-hover:text-accent-text">{{ service.title }}</h3>
      <p class="mt-1 text-muted">{{ service.summary }}</p>
    </div>
    <div class="flex shrink-0 items-center gap-3">
      <span v-if="service.price_from != null" class="whitespace-nowrap font-semibold tabular-nums">From {{ formatPrice(service.price_from) }}</span>
      <PhCaretRight :size="20" class="shrink-0 transition-transform duration-300 ease-settle motion-safe:group-hover:translate-x-1" />
    </div>
  </a>
</template>
