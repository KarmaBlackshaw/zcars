<script setup lang="ts">
defineOptions({ name: "BaseChip" });

const { tone = "night" } = defineProps<{
  tone?: "night" | "accent";
}>();

const toneClasses = {
  night: "bg-night/80 text-white",
  accent: "bg-accent text-white",
};
</script>

<template>
  <span :class="['clip-slant inline-flex items-center gap-1 px-3 py-1 font-display text-label uppercase italic [--slant:6px]', toneClasses[tone]]">
    <slot></slot>
  </span>
</template>
