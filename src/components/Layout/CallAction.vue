<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutCallAction" });

const { size = "md" } = defineProps<{ size?: "md" | "sm" }>();
</script>

<template>
  <BaseButton variant="light" :size="size" :href="site.tel_href">
    <PhPhone class="shrink-0" />
    <span class="desk:hidden">Call</span>
    <span class="hidden desk:inline">Call {{ site.phone_display }}</span>
  </BaseButton>
</template>
