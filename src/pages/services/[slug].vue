<script setup lang="ts">
import { PhCheck, PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { projects, services, site } from "virtual:content";

defineOptions({ name: "ServicePage" });

const route = useRoute("/services/[slug]");
const quoteDrawer = useQuoteDrawer();

const service = computed(() => services.find(({ slug }) => slug === route.params.slug));
const heading = computed(() => `${service.value?.title} in ${site.city}`);
const intro = computed(() => service.value?.intro ?? service.value?.summary);
const priceLabel = computed(() => (service.value?.price_from != null ? `From ${formatPrice(service.value.price_from)}` : ""));
const serviceProjects = computed(() => projects.filter((project) => project.services.includes(route.params.slug)));

const otherServices = computed(() =>
  services.filter(({ slug }) => slug !== route.params.slug).map(({ slug, title }) => ({ title, href: getServicePath(slug) }))
);

function openQuote() {
  quoteDrawer.open(service.value?.title);
}
</script>

<template>
  <main id="main" tabindex="-1" class="focus:outline-none">
    <template v-if="service">
      <section class="pb-12 pt-6 desk:py-16">
        <BaseContainer class="grid gap-10 desk:grid-cols-12 desk:items-center desk:gap-12">
          <div class="desk:col-span-7">
            <p class="flex flex-wrap gap-2 text-small text-muted">
              <a href="/" class="hover:text-fg">Home</a>
              <span>/</span>
              <span class="text-fg">{{ service.title }}</span>
            </p>
            <h1 class="mt-4 max-w-[16ch] text-balance text-h2">{{ heading }}</h1>
            <p class="mt-5 max-w-[56ch] text-lead text-muted">{{ intro }}</p>
            <p v-if="priceLabel" class="mt-4 font-semibold">{{ priceLabel }}</p>
            <p v-if="service.price_note" class="text-small text-muted">{{ service.price_note }}</p>
            <div id="hero-actions" class="mt-8 grid grid-cols-2 gap-3 desk:flex desk:flex-wrap">
              <BaseButton :href="site.messenger_url">
                <PhMessengerLogo class="shrink-0" />
                Message us
              </BaseButton>
              <BaseButton variant="ghost" @click="openQuote">Get a quote</BaseButton>
              <BaseButton variant="ghost" :href="site.tel_href" class="col-span-2 desk:col-span-1">
                <PhPhone class="shrink-0" />
                Call {{ site.phone_display }}
              </BaseButton>
            </div>
          </div>
          <img
            v-if="service.photo"
            :src="service.photo"
            :alt="service.title"
            fetchpriority="high"
            class="aspect-[4/3] w-full rounded-card bg-surface object-cover desk:col-span-5"
          />
        </BaseContainer>
      </section>
      <section v-if="service.includes.length" aria-labelledby="included-title" class="border-t border-line py-12 desk:py-16">
        <BaseContainer>
          <BaseSectionHeading id="included-title" title="What's included" />
          <ul role="list" class="mt-8 grid gap-3 sm:grid-cols-2 desk:grid-cols-3">
            <li v-for="item in service.includes" :key="item" class="flex items-start gap-3 rounded-card bg-surface p-4">
              <PhCheck :size="20" weight="bold" class="mt-0.5 shrink-0 text-accent-text" />
              {{ item }}
            </li>
          </ul>
        </BaseContainer>
      </section>
      <ServiceWork v-if="serviceProjects.length" :projects="serviceProjects" />
      <section v-if="service.faqs.length" aria-labelledby="service-faq-title" class="border-t border-line py-12 desk:py-16">
        <BaseContainer class="max-w-3xl">
          <BaseSectionHeading id="service-faq-title" title="Common questions" />
          <BaseFaqList :items="service.faqs" class="mt-8" />
        </BaseContainer>
      </section>
      <section aria-labelledby="other-services-title" class="border-t border-line py-12 desk:py-16">
        <BaseContainer>
          <BaseSectionHeading id="other-services-title" title="Other services" />
          <ul role="list" class="mt-8 flex flex-wrap gap-2">
            <li v-for="other in otherServices" :key="other.href">
              <a
                :href="other.href"
                class="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-semibold transition-colors hover:border-muted"
              >
                {{ other.title }}
              </a>
            </li>
          </ul>
        </BaseContainer>
      </section>
    </template>
    <section v-else class="py-24">
      <BaseContainer>
        <h1 class="text-h2">Service not found</h1>
        <a href="/#services" class="mt-4 inline-flex min-h-11 items-center font-semibold text-accent-text hover:underline">See all services</a>
      </BaseContainer>
    </section>
  </main>
</template>
