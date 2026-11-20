<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutMainAction" });

const { size = "md" } = defineProps<{ size?: "lg" | "md" | "sm" }>();
</script>

<template>
  <BaseButton data-main-action data-qa="main-action" :href="site.messenger_url" :size="size">
    <PhMessengerLogo :size="20" class="shrink-0" />
    Send a photo on Messenger
  </BaseButton>
</template>
