<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";

import type { TFaqItem } from "@/types";

defineOptions({ name: "BaseFaqList" });

const { items } = defineProps<{ items: TFaqItem[] }>();
</script>

<template>
  <div class="divide-y divide-line border-y border-line">
    <details v-for="item in items" :key="item.question" class="group">
      <summary class="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
        {{ item.question }}
        <PhCaretDown aria-hidden="true" class="shrink-0 group-open:rotate-180 motion-safe:transition-transform" />
      </summary>
      <p class="whitespace-pre-line pb-5 text-muted">{{ item.answer }}</p>
    </details>
  </div>
</template>
