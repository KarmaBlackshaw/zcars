<script setup lang="ts">
defineOptions({ name: "BaseSectionHeading" });

const { title, lead, layout = "stacked" } = defineProps<{ title: string; lead?: string; layout?: "stacked" | "split" }>();

defineSlots<{ action?(): unknown }>();

const layoutClasses = {
  stacked: { root: "", action: "mt-6" },
  split: { root: "flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between", action: "md:shrink-0" },
};
</script>

<template>
  <div :class="layoutClasses[layout].root">
    <div class="max-w-[52rem]">
      <h2>{{ title }}</h2>
      <p v-if="lead" class="mt-5 max-w-[52ch] text-lead text-muted">{{ lead }}</p>
    </div>
    <div v-if="$slots.action" :class="layoutClasses[layout].action">
      <slot name="action"></slot>
    </div>
  </div>
</template>
