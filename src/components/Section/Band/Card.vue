<script setup lang="ts">
import type { Component } from "vue";

defineOptions({ name: "SectionBandCard" });

const { icon, title, text } = defineProps<{ icon: Component; title: string; text?: string }>();
</script>

<template>
  <li class="flex items-start gap-4 rounded-xl bg-surface/50 p-5 ring-1 ring-line transition-shadow duration-300 ease-settle hover:ring-accent">
    <component :is="icon" class="size-7 shrink-0 text-glow" />
    <div>
      <h3>{{ title }}</h3>
      <p v-if="text" class="mt-2 text-small text-muted">{{ text }}</p>
    </div>
  </li>
</template>
