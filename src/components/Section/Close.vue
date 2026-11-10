<script setup lang="ts">
import { home, site } from "virtual:content";

defineOptions({ name: "SectionClose" });

const brandLine = computed(() => (home.hero_title_accent == null ? home.hero_title : `${home.hero_title} ${home.hero_title_accent}`));
</script>

<template>
  <BasePanel>
    <div class="py-20 desk:py-28">
      <h2 class="text-display desk:max-w-[75%]">{{ brandLine }}</h2>
      <p class="mt-6 text-lead text-muted">
        {{ site.name }} in {{ site.locality }}. <a :href="site.tel_href" class="font-semibold text-link hover:underline">Call {{ site.phone_display }}</a
        >.
      </p>
      <div class="mt-10 flex flex-col gap-3 desk:flex-row">
        <LayoutMainAction class="w-full desk:w-auto" />
        <LayoutCallAction class="w-full desk:w-auto" />
      </div>
    </div>
  </BasePanel>
</template>
