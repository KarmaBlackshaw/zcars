<script setup lang="ts">
import { PhCheck } from "@phosphor-icons/vue";
import { projects, services, site } from "virtual:content";
import { gridClasses } from "@/constants/section";

defineOptions({ name: "ServicePage" });

const route = useRoute("/services/[slug]");

const service = computed(() => services.find(({ slug }) => slug === route.params.slug));
const showcase = computed(() => (service.value == null ? undefined : getServiceShowcase(service.value, projects)));
const otherServices = computed(() => services.filter(({ slug }) => slug !== route.params.slug));
const workProjects = computed(() => showcase.value?.workProjects ?? []);

const title = computed(() => service.value?.title ?? "");
const heading = computed(() => `${title.value} in ${site.city}`);
const lead = computed(() => service.value?.intro ?? service.value?.summary ?? "");
const priceText = computed(() => (service.value?.price_from != null ? `From ${formatPrice(service.value.price_from)}` : ""));
const pictureAlt = computed(() => showcase.value?.project?.title ?? title.value);
const includedTitle = computed(() => `What ${toMidSentence(title.value)} includes`);
const faqTitle = computed(() => `${title.value} questions`);
const visitTitle = `Visit the shop in ${site.locality}`;
const workTitle = computed(() => `${title.value} jobs from our shop`);
const hasIncludes = computed(() => (service.value?.includes.length ?? 0) > 0);
const hasPicture = computed(() => showcase.value?.src != null);
const pictureSpanClass = computed(() => (hasIncludes.value ? "desk:col-span-5" : "desk:col-span-8"));

const sideSpanClass = computed(() => {
  if (!hasPicture.value) {
    return "desk:col-span-12";
  }

  return hasIncludes.value ? "desk:col-span-7" : "desk:col-span-4";
});
const sideRowsClass = computed(() => (hasIncludes.value ? "desk:grid-rows-[1fr_auto]" : ""));
</script>

<template>
  <main>
    <template v-if="service">
      <SectionHero :heading="heading" :lead="lead" :quote-service="service.title">
        <template #top>
          <p class="mb-4 flex flex-wrap gap-2 text-micro text-muted/70">
            <a href="/" class="hover:text-fg">Home</a>
            <span>/</span>
            <span>{{ service.title }}</span>
          </p>
        </template>
        <template #facts>
          <p v-if="priceText">
            {{ priceText }}
            <span v-if="service.price_note" class="ml-1 font-normal text-muted">{{ service.price_note }}</span>
          </p>
          <p>Free quote. We confirm the price before any work starts.</p>
        </template>
        <template #bento>
          <div :class="[gridClasses, 'desk:h-[32.5rem]']">
            <SectionHeroPicture v-if="showcase?.src != null" :src="showcase.src" :alt="pictureAlt" :project="showcase.project" :class="pictureSpanClass" />
            <div class="grid gap-3 desk:gap-4" :class="[sideSpanClass, sideRowsClass]">
              <BaseTile v-if="hasIncludes" padding="md" class="[--delay:160ms] motion-safe:animate-rise">
                <h2 class="text-h3">{{ includedTitle }}</h2>
                <ul class="mt-5 grid gap-x-8 gap-y-3 desk:grid-cols-2">
                  <li v-for="item in service.includes" :key="item" class="flex items-start gap-3">
                    <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0 text-accent" />
                    {{ item }}
                  </li>
                </ul>
              </BaseTile>
              <SectionHeroVisitTile class="[--delay:220ms] motion-safe:animate-rise" />
            </div>
          </div>
        </template>
      </SectionHero>
      <SectionWork :title="workTitle" :projects="workProjects" />
      <SectionFaq :title="faqTitle" :items="service.faqs" />
      <SectionVisit :title="visitTitle" />
      <SectionServices id="other-services" title="Other services at Zcars" :services="otherServices" />
      <SectionClose />
    </template>
    <section v-else class="pb-24 pt-32">
      <BaseContainer>
        <h2>Service not found</h2>
        <BaseButton variant="text" href="/#services" class="mt-4">See all services</BaseButton>
      </BaseContainer>
    </section>
  </main>
</template>
