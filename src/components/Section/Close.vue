<script setup lang="ts">
import { home, site } from "virtual:content";
import { sectionClasses } from "@/constants/section";

defineOptions({ name: "SectionClose" });

const brandLine = computed(() => (home.hero_title_accent == null ? home.hero_title : `${home.hero_title} ${home.hero_title_accent}`));
</script>

<template>
  <section id="close" class="bg-surface" :class="sectionClasses">
    <BaseContainer v-motion="revealFade()" class="grid gap-6 desk:grid-cols-12 desk:items-end desk:gap-8">
      <div class="desk:col-span-8">
        <h2>{{ brandLine }}</h2>
        <p class="mt-4 text-lead text-muted">
          {{ site.name }} in {{ site.locality }}.
          <a :href="site.tel_href" class="font-semibold text-accent-text hover:underline">Call {{ site.phone_display }}</a
          >.
        </p>
      </div>
      <LayoutMainAction class="w-full desk:col-span-4 desk:w-auto desk:justify-self-end" />
    </BaseContainer>
  </section>
</template>
