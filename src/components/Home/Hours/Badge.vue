<script setup lang="ts">
defineOptions({ name: "HomeHoursBadge" });

const openNow = useOpenNow();

const isOpen = computed(() => openNow.status.value?.isOpen === true);

const text = computed(() => {
  const status = openNow.status.value;

  if (status == null) {
    return "";
  }

  if (status.isOpen) {
    return `Open until ${status.closesAt}`;
  }

  return status.opensNext ? `Closed, opens ${status.opensNext.day} ${status.opensNext.time}` : "Closed";
});
</script>

<template>
  <span v-if="openNow.status.value != null" class="inline-flex items-center gap-1.5 text-micro font-semibold" :class="isOpen ? 'text-success' : 'text-muted'">
    <span aria-hidden="true" class="size-2 shrink-0 rounded-full" :class="isOpen ? 'bg-success' : 'bg-muted'"></span>
    {{ text }}
  </span>
</template>
