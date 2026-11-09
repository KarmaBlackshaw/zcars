<script setup lang="ts">
defineOptions({ name: "BaseSectionHeading" });

defineProps<{
  id: string;
  title: string;
  lead?: string;
}>();
</script>

<template>
  <div>
    <h2 :id="id">{{ title }}</h2>
    <p v-if="lead" class="mt-5 max-w-[60ch] text-lead text-muted">{{ lead }}</p>
    <slot></slot>
  </div>
</template>
