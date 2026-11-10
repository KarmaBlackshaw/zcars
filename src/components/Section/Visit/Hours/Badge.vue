<script setup lang="ts">
defineOptions({ name: "SectionVisitHoursBadge" });

const openNow = useOpenNow();

const isOpen = computed(() => openNow.status.value?.isOpen === true);
</script>

<template>
  <span v-if="openNow.status.value != null" class="inline-flex items-center gap-1.5 text-micro font-semibold" :class="isOpen ? 'text-success' : 'text-muted'">
    <span aria-hidden="true" class="size-2 shrink-0" :class="isOpen ? 'bg-success' : 'bg-muted'"></span>
    {{ openNow.label.value }}
  </span>
</template>
