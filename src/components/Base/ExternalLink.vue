<script setup lang="ts">
defineOptions({ name: "BaseExternalLink" });

defineProps<{ href: string }>();
</script>

<template>
  <a :href="href" target="_blank" rel="noopener">
    <slot></slot>
    <span class="sr-only"> (opens in new tab)</span>
  </a>
</template>
