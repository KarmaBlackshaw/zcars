<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutMainAction" });

const { size = "md", variant = "primary" } = defineProps<{ size?: "md" | "sm"; variant?: "primary" | "light" }>();
</script>

<template>
  <BaseButton data-main-action :href="site.messenger_url" :size="size" :variant="variant">
    <PhMessengerLogo class="shrink-0" />
    <slot>Send a photo on Messenger</slot>
  </BaseButton>
</template>
