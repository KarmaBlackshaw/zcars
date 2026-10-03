<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import logo from "@/assets/images/logo.webp";
import { BUSINESS_NAME, NAV_LINKS, PHONE_DISPLAY, PHONE_HREF } from "@/types";

defineOptions({ name: "LayoutNav" });

const brandLabel = `${BUSINESS_NAME}, home`;
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-line bg-bg/[.82] backdrop-blur-[14px]">
    <BaseContainer class="flex h-nav items-center justify-between gap-4">
      <a href="#top" :aria-label="brandLabel" class="flex items-center gap-3 font-bold [font-stretch:115%]">
        <img :src="logo" alt="" width="40" height="40" class="size-10 rounded-full" />
        Zcars
      </a>
      <nav aria-label="Primary" class="hidden desk:block">
        <ul class="flex gap-8">
          <li v-for="link in NAV_LINKS" :key="link.href">
            <a :href="link.href" class="font-medium text-muted hover:text-fg">{{ link.label }}</a>
          </li>
        </ul>
      </nav>
      <BaseButton size="sm" :href="PHONE_HREF">
        <PhPhone aria-hidden="true" class="shrink-0" />
        <span class="max-[480px]:sr-only">Call {{ PHONE_DISPLAY }}</span>
      </BaseButton>
    </BaseContainer>
  </header>
</template>
