<script setup lang="ts">
import { projects, services, site } from "virtual:content";
import PhCheck from "~icons/ph/check";

defineOptions({ name: "ServicePage" });

const route = useRoute("/services/[slug]");

const service = computed(() => services.find(({ slug }) => slug === route.params.slug));
const showcase = computed(() => (service.value == null ? undefined : getServiceShowcase(service.value, projects)));
const workProjects = computed(() => showcase.value?.workProjects ?? []);
const compareProject = computed(() => showcase.value?.compareProject);

const title = computed(() => service.value?.title ?? "");
const lead = computed(() => service.value?.intro ?? service.value?.summary ?? "");
const priceText = computed(() => (service.value?.price_from != null ? `From ${formatPrice(service.value.price_from)}` : ""));

const heroImage = computed(() => {
  const src = showcase.value?.src;

  return src == null ? undefined : { src, alt: showcase.value?.project?.title ?? title.value };
});
const hasIncludes = computed(() => (service.value?.includes.length ?? 0) > 0);
const bandTitle = computed(() => (hasIncludes.value ? `What ${toMidSentence(title.value)} includes` : `${title.value} results`));
const accent = computed(() => `in ${site.city}.`);
const workTitle = computed(() => `${title.value} jobs from our shop`);
const faqTitle = computed(() => `${title.value} questions`);
const visitTitle = `Visit the shop in ${site.locality}`;
</script>

<template>
  <main>
    <template v-if="service">
      <SectionHero :heading="title" :accent="accent" :lead="lead" :image="heroImage" :quote-service="service.title">
        <template #eyebrow>
          <a href="/" class="hover:underline">Home</a>
          / {{ service.title }}
        </template>
        <template #facts>
          <p v-if="priceText">
            <span class="font-display font-black italic">{{ priceText }}</span>
            <span v-if="service.price_note" class="font-normal text-muted">{{ service.price_note }}</span>
          </p>
          <p>Free quote. We confirm the price before any work starts.</p>
        </template>
      </SectionHero>
      <ServiceStrip :services="services" :active-slug="service.slug" />
      <SectionBand v-if="hasIncludes || compareProject != null" :title="bandTitle" :project="compareProject">
        <template v-if="hasIncludes" #default>
          <SectionBandCard v-for="item in service.includes" :key="item" :icon="PhCheck" :title="item" />
        </template>
      </SectionBand>
      <SectionWork :title="workTitle" :projects="workProjects" />
      <SectionActions class="bg-surface" :quote-service="service.title" />
      <SectionFaq :title="faqTitle" :items="service.faqs" />
      <SectionVisit class="bg-surface" :title="visitTitle" />
    </template>
    <SectionNotFound v-else />
  </main>
</template>
