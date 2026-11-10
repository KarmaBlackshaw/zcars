<script setup lang="ts">
import { PhPlus } from "@phosphor-icons/vue";
import type { TFaqItem } from "@/types";

defineOptions({ name: "BaseFaqList" });

const { items } = defineProps<{ items: TFaqItem[] }>();
</script>

<template>
  <div class="divide-y divide-line">
    <details v-for="item in items" :key="item.question" class="group py-5">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <h3>{{ item.question }}</h3>
        <PhPlus :size="20" class="shrink-0 text-accent transition-transform duration-300 ease-settle group-open:rotate-45" />
      </summary>
      <p class="mt-3 max-w-[68ch] whitespace-pre-line text-muted">{{ item.answer }}</p>
    </details>
  </div>
</template>
