<script setup lang="ts">
defineOptions({ name: "BaseSectionHeading" });

const { eyebrow } = defineProps<{
  id: string;
  title: string;
  eyebrow?: string;
  lead?: string;
}>();

const titleClass = computed(() => (eyebrow ? "mt-4" : undefined));
</script>

<template>
  <div>
    <BaseEyebrow v-if="eyebrow">{{ eyebrow }}</BaseEyebrow>
    <h2 :id="id" :class="titleClass">{{ title }}</h2>
    <p v-if="lead" class="mt-5 max-w-[60ch] text-lead text-muted">{{ lead }}</p>
    <slot></slot>
  </div>
</template>
