<script setup lang="ts">
defineOptions({ name: "BaseChip" });

const { size = "sm" } = defineProps<{
  size?: "sm" | "md";
}>();

const sizeClasses = {
  sm: "px-2.5 py-1 text-micro",
  md: "h-9 px-4 text-small font-semibold",
};
</script>

<template>
  <span :class="['inline-flex items-center gap-1 rounded-full bg-white/90 text-night', sizeClasses[size]]">
    <slot></slot>
  </span>
</template>
