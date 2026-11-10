<script setup lang="ts">
import { site } from "virtual:content";
import PhMessengerLogo from "~icons/ph/messenger-logo";

defineOptions({ name: "LayoutMainAction" });

const { size = "md", variant = "primary" } = defineProps<{ size?: "md" | "sm"; variant?: "primary" | "light" }>();
</script>

<template>
  <BaseButton data-main-action :href="site.messenger_url" :size="size" :variant="variant">
    <PhMessengerLogo class="shrink-0" />
    <slot>Send a photo on Messenger</slot>
  </BaseButton>
</template>
