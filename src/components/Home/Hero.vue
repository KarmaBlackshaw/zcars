<script setup lang="ts">
import { PhArrowRight, PhMapPin, PhMessengerLogo, PhPhone, PhStar } from "@phosphor-icons/vue";
import { home, projects, reviews, services, site, stats } from "virtual:content";

defineOptions({ name: "HomeHero" });

const quoteDrawer = useQuoteDrawer();
const { activePromos } = usePromos();

const pairs = projects.filter((project) => project.before_photo != null);
const hasMultiplePairs = pairs.length > 1;
const pairThumbnails = pairs.map(({ photos, title }) => ({ src: photos[0], alt: title }));
const sliderHeightClass = hasMultiplePairs ? "desk:max-h-[calc(100dvh-theme(spacing.nav)-10rem)]" : "desk:max-h-[calc(100dvh-theme(spacing.nav)-5rem)]";
const selectedPair = ref(0);

const showcase = computed(() => pairs[selectedPair.value] ?? projects[0]);

const showcaseCaption = computed(() => {
  const showcaseServices = services
    .filter((service) => showcase.value?.services.includes(service.slug))
    .map((service) => service.title)
    .join(", ");

  return showcaseServices ? `${showcase.value?.vehicle} · ${showcaseServices}` : showcase.value?.vehicle;
});

const averageRating = getAverageRating(reviews.map((review) => review.rating));

const promo = computed(() => activePromos.value[0]);

function openQuote() {
  quoteDrawer.open();
}
</script>

<template>
  <section>
    <BaseContainer
      class="grid grid-cols-1 gap-x-12 gap-y-6 pb-12 pt-6 desk:min-h-[calc(100dvh-theme(spacing.nav))] desk:grid-cols-12 desk:grid-rows-2 desk:py-10"
    >
      <div v-motion="enter()" class="desk:col-span-6 desk:self-end">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h1
            class="inline-flex items-center gap-2 text-balance text-micro font-semibold uppercase leading-snug tracking-eyebrow text-accent-text [font-stretch:normal]"
          >
            <PhMapPin class="shrink-0" />
            {{ home.hero_heading }}
          </h1>
          <HomeHoursBadge />
        </div>
        <p class="mt-4 max-w-[14ch] text-balance text-h1 font-extrabold tracking-heading [font-stretch:125%] desk:mt-6">
          {{ home.hero_title }} <em v-if="home.hero_title_accent" class="not-italic text-accent-text">{{ home.hero_title_accent }}</em>
        </p>
      </div>
      <figure v-if="showcase" v-motion="enter(0.12)" class="desk:col-span-6 desk:col-start-7 desk:row-span-2 desk:row-start-1 desk:self-center">
        <BaseCompareSlider
          v-if="showcase.before_photo"
          :before="showcase.before_photo"
          :after="showcase.photos[0]"
          :alt="showcase.title"
          class="aspect-[4/3] rounded-card bg-surface desk:aspect-[4/5] desk:w-full"
          :class="sliderHeightClass"
        />
        <img
          v-else
          :src="showcase.photos[0]"
          :alt="showcase.title"
          fetchpriority="high"
          class="aspect-[4/3] w-full rounded-card bg-surface object-cover desk:aspect-[4/5] desk:max-h-[calc(100dvh-theme(spacing.nav)-5rem)]"
        />
        <figcaption class="mt-2 flex items-center justify-between gap-4 text-micro text-muted">
          <span>{{ showcaseCaption }}</span>
          <span v-if="showcase.before_photo" class="shrink-0">Drag to compare</span>
        </figcaption>
        <BaseThumbnails v-if="hasMultiplePairs" v-model="selectedPair" :items="pairThumbnails" class="mt-3" />
      </figure>
      <div v-motion="enter(0.06)" class="desk:col-span-6 desk:row-start-2 desk:self-start">
        <p class="max-w-[46ch] text-lead text-muted">{{ home.hero_lead }}</p>
        <div id="hero-actions" class="mt-6 grid grid-cols-2 gap-3 desk:mt-8 desk:flex desk:flex-wrap">
          <BaseButton :href="site.messenger_url">
            <PhMessengerLogo class="shrink-0" />
            Message us
          </BaseButton>
          <BaseButton variant="ghost" :href="site.tel_href">
            <PhPhone class="shrink-0" />
            <span class="desk:hidden">Call</span>
            <span class="hidden desk:inline">Call {{ site.phone_display }}</span>
          </BaseButton>
        </div>
        <button type="button" class="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-text hover:underline" @click="openQuote">
          Or send photos for a quote
          <PhArrowRight class="shrink-0" />
        </button>
        <a
          v-if="promo"
          href="#promos"
          class="mt-4 flex max-w-md items-center gap-3 rounded-xl border border-line bg-surface p-2 pr-4 transition-colors hover:border-muted"
        >
          <span class="shrink-0 rounded-lg bg-accent px-2.5 py-1.5 text-micro font-bold uppercase text-white">Promo</span>
          <span class="min-w-0 flex-1 truncate text-small font-semibold">{{ promo.title }}</span>
          <span v-if="promo.price_label" class="shrink-0 font-bold tabular-nums text-accent-text">{{ promo.price_label }}</span>
          <PhArrowRight class="shrink-0 text-muted" />
        </a>
        <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small text-muted">
          <li v-if="averageRating">
            <a href="#reviews" class="inline-flex items-center gap-1.5 hover:text-fg">
              <PhStar weight="fill" class="text-accent-text" />
              <strong class="font-semibold text-fg">{{ averageRating }}</strong>
              from {{ reviews.length }} reviews
            </a>
          </li>
          <li v-for="stat in stats" :key="stat.id">
            <strong class="font-semibold text-fg">{{ stat.value }}</strong>
            {{ stat.label }}
          </li>
        </ul>
      </div>
    </BaseContainer>
  </section>
</template>
