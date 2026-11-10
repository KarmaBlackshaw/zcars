<script setup lang="ts">
import { MotionConfig } from "motion-v";

defineOptions({ name: "App" });
</script>

<template>
  <MotionConfig reduced-motion="user">
    <a href="#main" class="sr-only z-30 rounded bg-bg px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"> Skip to content </a>
    <LayoutNav />
    <RouterView />
    <LayoutFooter />
    <LayoutActionBar />
    <HomeQuoteDrawer />
  </MotionConfig>
</template>
