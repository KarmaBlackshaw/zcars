<script setup lang="ts">
defineOptions({ name: "IndexPage" });
</script>

<template>
  <LayoutNav />
  <main id="top" class="scroll-mt-[69px]">
    <HomeHero />
    <HomePartners />
    <HomeServices />
    <HomeRepaint />
    <HomeTeam />
    <HomeVisit />
  </main>
  <LayoutFooter />
</template>
