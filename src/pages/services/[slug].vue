<script setup lang="ts">
import { projects, services, site } from "virtual:content";

defineOptions({ name: "ServicePage" });

const route = useRoute("/services/[slug]");

const service = computed(() => services.find(({ slug }) => slug === route.params.slug));
const showcase = computed(() => (service.value == null ? undefined : getServiceShowcase(service.value, projects)));
const workProjects = computed(() => showcase.value?.workProjects ?? []);
const compareProject = computed(() => showcase.value?.compareProject);

const title = computed(() => service.value?.title ?? "");
const numeral = computed(() => (service.value == null ? "" : formatServiceNumber(service.value.position)));
const lead = computed(() => service.value?.intro ?? service.value?.summary ?? "");
const priceText = computed(() => (service.value?.price_from != null ? `From ${formatPrice(service.value.price_from)}` : ""));
const includes = computed(() => service.value?.includes ?? []);
const hasIncludesSection = computed(() => includes.value.length > 0 || compareProject.value != null);
const includesTitle = computed(() => (includes.value.length > 0 ? `What ${toMidSentence(title.value)} includes` : `${title.value} results`));
const accent = `in ${site.city}`;
const workTitle = computed(() => `${title.value} jobs from our shop`);
const faqTitle = computed(() => `${title.value} questions`);
const visitTitle = `Visit the shop in ${site.locality}`;
</script>

<template>
  <main>
    <template v-if="service">
      <SectionHero :heading="title" :accent="accent" :lead="lead" :project="showcase?.project" :numeral="numeral" :quote-service="service.title">
        <template #facts>
          <p v-if="priceText">
            <span class="font-display text-h3 font-black">{{ priceText }}</span>
            <span v-if="service.price_note">{{ service.price_note }}</span>
          </p>
          <p>Free quote from a photo. We confirm the price before any work starts.</p>
        </template>
      </SectionHero>
      <ServiceIncludes v-if="hasIncludesSection" :title="includesTitle" :items="includes" :project="compareProject" />
      <SectionWork :title="workTitle" :projects="workProjects" />
      <SectionFaq :title="faqTitle" :items="service.faqs" />
      <ServiceRoster title="Other services at Zcars" :services="services" :active-slug="service.slug" class="border-t border-bluishWhite" />
      <SectionVisit :title="visitTitle" :quote-service="service.title" />
    </template>
    <SectionNotFound v-else />
  </main>
</template>
