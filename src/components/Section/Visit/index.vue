<script setup lang="ts">
import { PhMapPin, PhNavigationArrow } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";

defineOptions({ name: "SectionVisit" });

const { title, quoteService } = defineProps<{ title: string; quoteService?: string }>();

const mapTitle = `Map to ${site.name}, ${site.locality}`;

const quoteDrawer = useQuoteDrawer();
const mapFrame = ref<HTMLElement>();
const isMapNear = useElementVisibility(mapFrame, { rootMargin: "200px", once: true });

function openQuote() {
  quoteDrawer.open(quoteService);
}
</script>

<template>
  <section id="visit" class="kit-home scroll-mt-nav" data-qa="visit">
    <div class="rib"></div>
    <BaseContainer>
      <div class="grid gap-12 py-16 desk:grid-cols-12 desk:gap-14 desk:py-28">
        <div class="desk:col-span-5">
          <BaseSectionHeading :title="title" :lead="home.contact_lead" />
          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LayoutMainAction size="lg" class="w-full sm:w-auto" />
          </div>
          <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BaseButton variant="ghost" size="lg" data-qa="visit-quote" @click="openQuote">Request a quote</BaseButton>
            <LayoutCallAction size="lg" />
          </div>
          <div class="mt-10 flex items-start gap-3 border-t border-line pt-6">
            <PhMapPin :size="22" weight="fill" class="mt-0.5 shrink-0" />
            <div class="grid justify-items-start gap-1">
              <address class="not-italic" data-qa="visit-address">{{ site.address }}</address>
              <BaseButton variant="text" :href="site.map_directions_url" data-qa="visit-directions">
                <PhNavigationArrow :size="16" weight="fill" class="shrink-0" />
                Get directions
              </BaseButton>
            </div>
          </div>
          <div class="mt-6 border-t border-line pt-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3>Opening hours</h3>
              <HoursStatus />
            </div>
            <SectionVisitHoursTable class="mt-3" />
          </div>
        </div>
        <div
          ref="mapFrame"
          class="relative h-80 overflow-clip rounded-lg border-4 border-white bg-americanDiamond text-coveGray desk:col-span-7 desk:h-auto desk:min-h-[560px]"
          data-qa="visit-map"
        >
          <div class="absolute inset-0 grid place-content-center justify-items-center gap-2">
            <PhMapPin :size="32" />
            <a :href="site.map_directions_url" v-bind="getLinkAttrs(site.map_directions_url)" class="font-bold text-blueGrotto underline underline-offset-4"
              >Open in Google Maps</a
            >
          </div>
          <iframe
            v-if="isMapNear"
            :src="site.map_embed_url"
            :title="mapTitle"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="absolute inset-0 size-full border-0"
          ></iframe>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
