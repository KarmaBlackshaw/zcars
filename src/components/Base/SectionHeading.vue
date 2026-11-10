<script setup lang="ts">
defineOptions({ name: "BaseSectionHeading" });

defineProps<{
  title: string;
  lead?: string;
}>();
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <p v-if="lead" class="mt-5 max-w-[44ch] text-lead text-muted">{{ lead }}</p>
    <slot></slot>
  </div>
</template>
