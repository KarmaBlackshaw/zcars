<script setup lang="ts">
import { HERO_PHOTO } from "@/constants/hero";

defineOptions({ name: "SectionHero" });

const { heading, accent, lead, image, quoteService } = defineProps<{
  heading: string;
  accent?: string;
  lead: string;
  image?: { src: string; alt: string };
  quoteService?: string;
}>();

defineSlots<{ eyebrow?(): unknown; facts?(): unknown }>();

const quoteDrawer = useQuoteDrawer();

function openQuote() {
  quoteDrawer.open(quoteService);
}
</script>

<template>
  <section class="night relative isolate overflow-clip bg-night pb-24 pt-10 desk:pb-28 desk:pt-16">
    <div v-if="image" class="hero-exit absolute inset-0 overflow-clip desk:left-auto desk:w-[62%]">
      <BaseImage
        :src="image.src"
        :sizes="HERO_PHOTO.sizes"
        :alt="image.alt"
        fetchpriority="high"
        decoding="async"
        class="size-full object-cover object-[50%_45%] brightness-[.72] contrast-125 saturate-[.8]"
      />
      <div class="absolute inset-0 bg-accent/25 mix-blend-multiply"></div>
      <div class="streaks streak-drift absolute inset-0"></div>
      <div class="hero-fade absolute inset-0"></div>
      <div class="hero-exit-fade absolute inset-0 bg-night opacity-0"></div>
      <div class="streak-drift pointer-events-none absolute inset-0">
        <span class="comet absolute right-[22%] top-[-4%] hidden h-[3px] w-[180px] motion-safe:block"></span>
        <span class="comet absolute right-[48%] top-[-4%] hidden h-[3px] w-[180px] [--delay:3.4s] [--dur:9s] motion-safe:block"></span>
      </div>
    </div>
    <BaseContainer class="relative z-10">
      <div class="hero-exit-content">
        <p
          v-if="$slots.eyebrow"
          class="font-display text-eyebrow uppercase italic tracking-[.2em] text-glow [--delay:0ms] motion-safe:animate-slash desk:tracking-[.35em]"
        >
          <slot name="eyebrow"></slot>
        </p>
        <h1 class="mt-4 max-w-[60rem] [--delay:120ms] motion-safe:animate-slash">
          {{ heading }} <span v-if="accent" class="block text-glow">{{ accent }}</span>
        </h1>
        <p class="mt-6 max-w-[34rem] text-lead text-fg/85 [--delay:250ms] motion-safe:animate-enter">{{ lead }}</p>
        <div v-if="$slots.facts" class="mt-5 text-small font-semibold [--delay:250ms] motion-safe:animate-enter">
          <slot name="facts"></slot>
        </div>
        <div class="mt-8 flex flex-wrap items-center justify-between gap-3 [--delay:350ms] motion-safe:animate-enter md:justify-start desk:mt-10 desk:gap-4">
          <LayoutMainAction class="w-full md:w-auto" />
          <LayoutCallAction />
          <BaseButton variant="text" @click="openQuote">Or use the quote form</BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
