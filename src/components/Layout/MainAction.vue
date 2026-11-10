<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutMainAction" });

const { size = "md" } = defineProps<{ size?: "md" | "sm" }>();
</script>

<template>
  <BaseButton data-main-action :href="site.messenger_url" :size="size">
    <PhMessengerLogo class="shrink-0" />
    Send a photo on Messenger
  </BaseButton>
</template>
