<script setup lang="ts">
defineOptions({ name: "IndexPage" });
</script>

<template>
  <a href="#main" class="sr-only z-30 rounded-full bg-bg px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"> Skip to content </a>
  <LayoutPromoStrip />
  <LayoutNav />
  <main id="main" tabindex="-1" class="focus:outline-none">
    <HomeHero />
    <HomeServices />
    <HomeProjects />
    <HomeRepaint />
    <HomeHow />
    <HomeReviews />
    <HomePartners />
    <HomeFaq />
    <HomeQuote />
    <HomeVisit />
    <HomeTeam />
  </main>
  <LayoutFooter />
  <LayoutActionBar />
</template>
