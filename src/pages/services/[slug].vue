<script setup lang="ts">
import { PhCheck } from "@phosphor-icons/vue";
import { projects, services, site } from "virtual:content";
import { ruledSectionClasses } from "@/constants/section";

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
</script>

<template>
  <main id="main" tabindex="-1" class="focus:outline-none">
    <template v-if="service">
      <SectionHero :heading="heading" :lead="lead" :quote-service="service.title">
        <template #top>
          <p class="mb-4 flex flex-wrap gap-2 text-small text-muted">
            <a href="/" class="hover:text-fg">Home</a>
            <span>/</span>
            <span class="text-fg">{{ service.title }}</span>
          </p>
        </template>
        <template #facts>
          <p v-if="priceText">
            {{ priceText }}
            <span v-if="service.price_note" class="ml-1 font-normal text-muted">{{ service.price_note }}</span>
          </p>
          <p>Free quote. We confirm the price before any work starts.</p>
        </template>
        <template v-if="showcase?.src != null" #picture>
          <SectionHeroPicture :src="showcase.src" :alt="pictureAlt" :project="showcase.project" />
        </template>
      </SectionHero>
      <section v-if="service.includes.length > 0" id="included" :class="ruledSectionClasses">
        <BaseContainer class="grid gap-8 desk:grid-cols-12 desk:gap-x-8">
          <div v-motion="revealFade()" class="desk:col-span-4">
            <BaseSectionHeading :title="includedTitle" />
          </div>
          <ul v-motion="revealFade(0.08)" class="grid desk:col-span-8 desk:grid-cols-2 desk:gap-x-8">
            <li v-for="item in service.includes" :key="item" class="flex items-start gap-3 border-b border-line py-4">
              <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0 text-fg" />
              {{ item }}
            </li>
          </ul>
        </BaseContainer>
      </section>
      <SectionWork title="Recent work" :projects="workProjects" />
      <SectionFaq :title="faqTitle" :items="service.faqs" />
      <SectionVisit :title="visitTitle" />
      <section id="other-services" :class="ruledSectionClasses">
        <BaseContainer>
          <div v-motion="revealFade()">
            <BaseSectionHeading title="Other services at Zcars" />
          </div>
          <ul class="mt-12 border-t border-line desk:mt-14 desk:grid desk:grid-cols-2 desk:gap-x-8">
            <li v-for="(other, index) in otherServices" :key="other.slug" v-motion="stagger(index)">
              <ServiceRow :service="other" />
            </li>
          </ul>
        </BaseContainer>
      </section>
      <SectionClose />
    </template>
    <section v-else class="py-24">
      <BaseContainer>
        <h2>Service not found</h2>
        <BaseButton variant="text" href="/#services" class="mt-4">See all services</BaseButton>
      </BaseContainer>
    </section>
  </main>
</template>
