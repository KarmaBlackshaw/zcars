<script setup lang="ts">
import { home, site } from "virtual:content";

import polishUrl from "@/assets/images/polish.webp";
import { gridClasses } from "@/constants/section";
import type { TProject } from "@/types";

defineOptions({ name: "HomeHero" });

const { project } = defineProps<{ project?: TProject }>();

const openNow = useOpenNow();
const { featuredPromo: promo } = usePromos();

const hasOpenStatus = computed(() => openNow.status.value != null);
const visitSpanClass = computed(() => (promo.value == null ? "md:row-span-2" : ""));
const polishSpanClass = computed(() => (project == null ? "desk:col-span-8" : "desk:col-span-3"));
</script>

<template>
  <SectionHero :heading="home.hero_heading" :lead="home.hero_lead">
    <template #facts>
      <div class="flex flex-wrap items-center gap-x-2">
        <HoursStatus />
        <span v-if="hasOpenStatus" class="hidden md:inline">·</span>
        <span>{{ site.locality }}</span>
      </div>
    </template>
    <template #bento>
      <div :class="[gridClasses, 'md:grid-cols-12 desk:h-[35rem] desk:grid-rows-2']">
        <SectionHeroPicture
          v-if="project != null"
          :src="project.photos[0]"
          :alt="project.title"
          :project="project"
          class="md:col-span-7 md:row-span-2 desk:col-span-5"
        />
        <div class="hidden [--delay:160ms] motion-safe:animate-rise desk:row-span-2 desk:block" :class="polishSpanClass">
          <BaseTile padding="none" class="size-full">
            <img :src="polishUrl" alt="Machine polishing on red paint" loading="lazy" class="size-full object-cover object-[50%_70%]" />
          </BaseTile>
        </div>
        <HomeHeroPromoTile v-if="promo != null" :promo="promo" class="[--delay:220ms] motion-safe:animate-rise md:col-span-5 desk:col-span-4" />
        <SectionHeroVisitTile class="[--delay:280ms] motion-safe:animate-rise md:col-span-5 desk:col-span-4" :class="visitSpanClass" />
      </div>
    </template>
  </SectionHero>
</template>
