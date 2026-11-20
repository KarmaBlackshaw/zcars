<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutCallAction" });

const { size = "md" } = defineProps<{ size?: "lg" | "md" | "sm" }>();
</script>

<template>
  <BaseButton variant="ghost" :size="size" :href="site.tel_href" data-qa="call-action">
    <PhPhone :size="18" class="shrink-0" />
    Call {{ site.phone_display }}
  </BaseButton>
</template>
