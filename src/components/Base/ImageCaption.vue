<script setup lang="ts">
defineOptions({ name: "BaseImageCaption" });
</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 via-night/50 to-transparent p-5 pt-16 text-white">
    <slot></slot>
  </div>
</template>
