<script setup lang="ts">
import { PhMinus, PhPlus } from "@phosphor-icons/vue";
import type { TFaqItem } from "@/types";

defineOptions({ name: "BaseFaqList" });

const { items } = defineProps<{ items: TFaqItem[] }>();
</script>

<template>
  <div class="divide-y divide-line border-y border-line">
    <details v-for="(item, index) in items" :key="item.question" class="group py-5" :data-qa="`faq-item-${index}`">
      <summary class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
        <h3 class="text-balance">{{ item.question }}</h3>
        <span class="grid size-9 shrink-0 place-items-center rounded border-1.5 border-line text-link transition-colors duration-200 group-hover:border-link">
          <PhPlus :size="18" weight="bold" class="group-open:hidden" />
          <PhMinus :size="18" weight="bold" class="hidden group-open:block" />
        </span>
      </summary>
      <p class="mt-3 max-w-[65ch] whitespace-pre-line text-muted">{{ item.answer }}</p>
    </details>
  </div>
</template>
