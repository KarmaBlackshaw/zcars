<script setup lang="ts">
defineOptions({ name: "HoursStatus" });

const openNow = useOpenNow();

const isOpen = computed(() => openNow.status.value?.isOpen === true);
const dotClass = computed(() => (isOpen.value ? "bg-success" : "bg-muted/50"));
</script>

<template>
  <span v-if="openNow.status.value != null" class="inline-flex items-center gap-2">
    <span class="size-2 shrink-0 rounded-full" :class="dotClass"></span>
    {{ openNow.label.value }}
  </span>
</template>
