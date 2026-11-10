<script setup lang="ts">
defineOptions({ name: "BasePanel" });
</script>

<template>
  <section class="night relative isolate scroll-mt-nav overflow-hidden bg-night">
    <span class="streaks pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-15"></span>
    <BaseContainer class="relative">
      <slot></slot>
    </BaseContainer>
  </section>
</template>
