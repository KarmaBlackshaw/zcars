<script setup lang="ts">
import { services } from "virtual:content";

import { HERO_PHOTO, SERVICE_PHOTO_SIZES } from "@/constants/hero";
import type { TProject } from "@/types";

defineOptions({ name: "SectionHero" });

const { heading, accent, lead, project, numeral, quoteService } = defineProps<{
  heading: string;
  accent?: string;
  lead: string;
  project?: TProject;
  numeral?: string;
  quoteService?: string;
}>();

defineSlots<{ facts?(): unknown }>();

const quoteDrawer = useQuoteDrawer();

const isHome = computed(() => numeral == null);

const tagNumbers = computed(() =>
  project == null
    ? ""
    : getProjectServices(project, services)
        .map(({ position }) => formatServiceNumber(position))
        .join(" · ")
);

const gridClass = computed(() => [
  isHome.value ? "desk:gap-x-8 xl:gap-x-14" : "desk:gap-x-16",
  project == null ? "desk:py-24" : "desk:min-h-[clamp(45rem,calc(100svh-108px),56rem)] desk:py-16",
]);
const copyClass = computed(() => (isHome.value ? "desk:col-span-7 xl:col-span-6" : "desk:col-span-7"));

const frameClass = computed(() =>
  isHome.value
    ? "desk:col-span-5 xl:col-span-6 desk:w-full desk:max-w-[40rem] desk:justify-self-end desk:aspect-[1200/1139]"
    : "desk:col-span-5 desk:aspect-[4/5]"
);
const tagClass = computed(() => (isHome.value ? "" : "max-desk:left-auto max-desk:right-4"));
const photoSizes = computed(() => (isHome.value ? HERO_PHOTO.sizes : SERVICE_PHOTO_SIZES));
const headingClass = computed(() => (isHome.value ? "" : "text-display-sm"));

function openQuote() {
  quoteDrawer.open(quoteService);
}
</script>

<template>
  <section class="kit-home overflow-clip" data-qa="hero">
    <BaseContainer>
      <div :class="gridClass" class="grid content-center pb-14 desk:grid-cols-12 desk:items-center">
        <div
          v-if="project"
          :class="frameClass"
          class="relative -mx-5 aspect-[4/3] overflow-clip desk:order-last desk:mx-0 desk:rounded-lg desk:motion-safe:animate-slide-in"
          data-qa="hero-photo"
        >
          <BaseImage
            :src="project.photos[0]"
            :sizes="photoSizes"
            :alt="project.title"
            fetchpriority="high"
            decoding="async"
            class="absolute inset-0 size-full object-cover object-[50%_62%] desk:object-[50%_55%]"
          />
          <div
            :class="tagClass"
            class="stitch absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-coveGray desk:bottom-5 desk:left-5"
            data-qa="hero-kit-tag"
          >
            <p v-if="tagNumbers" class="name-line tabular-nums">{{ tagNumbers }}</p>
            <p class="font-display text-xl font-extrabold uppercase leading-none desk:text-2xl">{{ project.vehicle }}</p>
          </div>
        </div>
        <div v-if="numeral && !project" class="pt-10 desk:order-last desk:col-span-5 desk:pr-5 desk:pt-0 desk:text-right">
          <BaseNumeral :value="numeral" size="hero" press="load" data-qa="hero-numeral" />
        </div>
        <div :class="copyClass" class="relative" :data-qa="isHome ? 'hero-copy' : 'service-hero-copy'">
          <BaseNumeral v-if="numeral && project" :value="numeral" size="xl" press="load" class="-mt-[.42em] mb-4 desk:mb-6 desk:mt-0" data-qa="hero-numeral" />
          <h1 :class="headingClass" class="max-desk:mt-8" data-qa="hero-title">
            <span class="block motion-safe:animate-rise">{{ heading }}</span>
            <span v-if="accent" class="block text-blueCream [--delay:80ms] motion-safe:animate-rise">{{ accent }}</span>
          </h1>
          <div class="motion-safe:animate-fade-up">
            <p class="mt-6 max-w-[34rem] text-lead" data-qa="hero-lead">{{ lead }}</p>
            <div v-if="$slots.facts" class="mt-5 text-small font-semibold" data-qa="hero-facts">
              <slot name="facts"></slot>
            </div>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center desk:mt-10">
              <LayoutMainAction size="lg" class="w-full sm:w-auto" />
              <LayoutCallAction size="lg" />
              <BaseButton variant="text" data-qa="hero-quote" class="self-start sm:self-auto" @click="openQuote">Request a quote</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
    <div class="rib"></div>
  </section>
</template>
