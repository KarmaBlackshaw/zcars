<script setup lang="ts">
defineOptions({ name: "App" });
</script>

<template>
  <LayoutUtilityBar />
  <LayoutNav />
  <RouterView />
  <LayoutFooter />
  <LayoutActionBar />
  <HomeQuoteDrawer />
</template>
