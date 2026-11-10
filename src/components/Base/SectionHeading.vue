<script setup lang="ts">
defineOptions({ name: "BaseSectionHeading" });

const {
  title,
  lead,
  layout = "stacked",
  size = "md",
} = defineProps<{
  title: string;
  lead?: string;
  layout?: "stacked" | "split";
  size?: "md" | "lg";
}>();

defineSlots<{ action?(): unknown }>();

const layoutClasses = {
  stacked: { root: "", action: "mt-6" },
  split: { root: "flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between", action: "md:shrink-0" },
};

const sizeClasses = { md: "", lg: "text-band" };
</script>

<template>
  <div class="reveal" :class="layoutClasses[layout].root">
    <div class="max-w-[60rem]">
      <h2 class="flex items-center gap-3" :class="sizeClasses[size]">
        <span class="inline-block h-[.72em] w-1.5 shrink-0 -skew-x-12 bg-accent"></span>
        <span>{{ title }}</span>
      </h2>
      <p v-if="lead" class="mt-4 max-w-[52ch] text-lead text-muted">{{ lead }}</p>
    </div>
    <div v-if="$slots.action" :class="layoutClasses[layout].action">
      <slot name="action"></slot>
    </div>
  </div>
</template>
