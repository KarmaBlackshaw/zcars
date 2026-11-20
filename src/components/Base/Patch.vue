<script setup lang="ts">
defineOptions({ name: "BasePatch" });

const { tone = "white" } = defineProps<{ tone?: "white" | "accent" | "outline" }>();

const toneClasses = {
  white: "stitch bg-white text-coveGray",
  accent: "stitch bg-electrifyingChartreuse text-coveGray",
  outline: "border-1.5 border-current",
};
</script>

<template>
  <span
    :class="['inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-micro font-bold uppercase [font-stretch:115%]', toneClasses[tone]]"
  >
    <slot></slot>
  </span>
</template>
