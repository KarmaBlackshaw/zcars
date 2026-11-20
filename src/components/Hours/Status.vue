<script setup lang="ts">
defineOptions({ name: "HoursStatus" });

const openNow = useOpenNow();

const shortTime = (time: string) => time.replace(":00", "");

const texts = computed(() => {
  const status = openNow.status.value;

  if (status == null) {
    return undefined;
  }

  if (status.isOpen) {
    return { long: `Open now · until ${status.closesAt}`, short: `Open · until ${shortTime(status.closesAt)}` };
  }

  if (status.opensNext == null) {
    return { long: "Closed", short: "Closed" };
  }

  const { day, time } = status.opensNext;

  return { long: `Closed · opens ${day} ${time}`, short: `Closed · opens ${shortTime(time)}` };
});

const tone = computed(() => (openNow.status.value?.isOpen ? "accent" : "outline"));
</script>

<template>
  <BasePatch v-if="texts" :tone="tone" data-qa="hours-status">
    <span class="desk:hidden">{{ texts.short }}</span>
    <span class="hidden desk:inline">{{ texts.long }}</span>
  </BasePatch>
</template>
