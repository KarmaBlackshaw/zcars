<script setup lang="ts">
defineOptions({ name: "BaseNumeral" });

const { value, size = "md", press = "scroll" } = defineProps<{ value: string; size?: "md" | "xl" | "hero"; press?: "scroll" | "load" }>();

const sizeClasses = { md: "text-numeral-md", xl: "text-numeral-xl", hero: "text-numeral-hero" };
const pressClasses = { scroll: "numeral-press-scroll", load: "numeral-press-load" };
</script>

<template>
  <span :data-num="value" :class="['numeral', sizeClasses[size], pressClasses[press]]">{{ value }}</span>
</template>
