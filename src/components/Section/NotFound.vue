<script setup lang="ts">
import { services } from "virtual:content";

defineOptions({ name: "SectionNotFound" });
</script>

<template>
  <SectionHero heading="Wrong turn." accent="Page not found." lead="The link is old or has a typo. Pick a service below, or get a free quote.">
    <template #eyebrow>Error 404</template>
  </SectionHero>
  <ServiceStrip :services="services" />
</template>
