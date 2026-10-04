<script setup lang="ts">
import { PhMapPin, PhMessengerLogo, PhPhone, PhStar } from "@phosphor-icons/vue";
import { home, reviews, services, site } from "virtual:content";

import logo from "@/assets/images/logo.webp";

defineOptions({ name: "HomeHero" });

const CHIP_LIMIT = 8;

const chips = services.slice(0, CHIP_LIMIT).map((service) => ({ href: `#service-${service.slug}`, title: service.title }));

const averageRating = getAverageRating(reviews.map((review) => review.rating));
</script>

<template>
  <section>
    <BaseContainer class="grid gap-10 pb-12 pt-10 desk:min-h-[calc(100dvh-theme(spacing.nav))] desk:grid-cols-12 desk:gap-8 desk:py-10">
      <div class="flex min-w-0 flex-col desk:col-span-7 desk:pr-8">
        <div class="desk:my-auto">
          <div class="flex min-h-6 flex-wrap items-center gap-x-4 gap-y-2">
            <BaseEyebrow v-motion="enter()">
              <PhMapPin aria-hidden="true" class="shrink-0" />
              {{ site.locality }}
            </BaseEyebrow>
            <HomeHoursBadge />
          </div>
          <h1 v-motion="enter(0.09)" class="mt-6 max-w-[13ch] text-balance">
            {{ home.hero.title }} <em class="not-italic text-accent-text">{{ home.hero.title_accent }}</em>
          </h1>
          <p v-motion="enter(0.18)" class="mt-6 max-w-[48ch] text-lead text-muted">{{ home.hero.lead }}</p>
          <div id="hero-actions" v-motion="enter(0.27)" class="mt-9 grid grid-cols-2 gap-3 desk:flex desk:flex-wrap">
            <BaseButton :href="site.tel_href">
              <PhPhone aria-hidden="true" class="shrink-0" />
              <span class="desk:hidden">Call</span>
              <span class="hidden desk:inline">Call {{ site.phone_display }}</span>
            </BaseButton>
            <BaseButton :href="site.messenger_url">
              <PhMessengerLogo aria-hidden="true" class="shrink-0" />
              Message
            </BaseButton>
            <BaseButton variant="ghost" href="#quote" class="col-span-2 desk:col-span-1">Get a quote</BaseButton>
          </div>
          <p v-if="averageRating" v-motion="enter(0.3)" class="mt-4 flex items-center gap-1.5 text-small text-muted">
            <PhStar weight="fill" aria-hidden="true" class="text-accent-text" />
            {{ averageRating }} from {{ reviews.length }} reviews
          </p>
        </div>
        <ul v-if="chips.length" role="list" aria-label="Jump to a service" v-motion="enter(0.36)" class="mt-10 hidden flex-wrap gap-2 desk:flex">
          <li v-for="chip in chips" :key="chip.href">
            <a :href="chip.href" class="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-muted px-4 text-small hover:border-fg">{{
              chip.title
            }}</a>
          </li>
        </ul>
      </div>
      <figure
        v-motion="enter(0.18)"
        class="relative aspect-[4/5] max-h-[80dvh] overflow-hidden rounded-card bg-surface desk:col-span-5 desk:aspect-auto desk:max-h-none"
      >
        <img :src="home.hero.image" :alt="site.name" fetchpriority="high" class="absolute inset-0 size-full object-cover" />
        <div
          aria-hidden="true"
          class="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl border border-white/10 bg-inkBlack/65 p-3 text-sportyWhite shadow-[inset_0_1px_0_theme(colors.white/10%)] backdrop-blur-md"
        >
          <img :src="logo" alt="" width="40" height="40" class="size-10 rounded-full" />
          <div class="leading-tight">
            <strong class="block text-small font-semibold">{{ site.name }}</strong>
            <span class="text-micro text-ghost">{{ site.locality }}</span>
          </div>
        </div>
      </figure>
    </BaseContainer>
  </section>
</template>
