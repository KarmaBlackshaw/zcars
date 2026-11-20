<script setup lang="ts">
import { services } from "virtual:content";

defineOptions({ name: "SectionNotFound" });
</script>

<template>
  <SectionHero
    heading="Page not found"
    lead="The link is old or has a typo. Pick a service below, or send us a photo of your car on Messenger."
    numeral="404"
  />
  <ServiceRoster :services="services" />
</template>
