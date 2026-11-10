<script setup lang="ts">
defineOptions({ name: "App" });
</script>

<template>
  <LayoutNav />
  <RouterView />
  <LayoutFooter />
  <LayoutActionBar />
  <HomeQuoteDrawer />
</template>
