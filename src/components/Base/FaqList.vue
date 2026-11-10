<script setup lang="ts">
import type { TFaqItem } from "@/types";

defineOptions({ name: "BaseFaqList" });

const { items } = defineProps<{ items: TFaqItem[] }>();
</script>

<template>
  <div class="divide-y divide-fg/10">
    <div v-for="item in items" :key="item.question" class="py-6">
      <h3>{{ item.question }}</h3>
      <p class="mt-2 max-w-[68ch] whitespace-pre-line text-muted">{{ item.answer }}</p>
    </div>
  </div>
</template>
