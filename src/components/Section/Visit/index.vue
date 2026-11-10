<script setup lang="ts">
import { PhMapPin, PhPhone } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";
import { ruledSectionClasses } from "@/constants/section";

defineOptions({ name: "SectionVisit" });

defineProps<{ title: string }>();

const mapTitle = `Map to ${site.name}, ${site.locality}`;

const mapFrame = ref<HTMLElement>();
const isMapNear = ref(false);

const { stop } = useIntersectionObserver(
  mapFrame,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isMapNear.value = true;
      stop();
    }
  },
  { rootMargin: "200px" }
);
</script>

<template>
  <section id="visit" :class="ruledSectionClasses">
    <BaseContainer class="grid gap-6 desk:grid-cols-12 desk:gap-8">
      <div v-motion="revealFade()" class="rounded bg-surface p-6 desk:col-span-6 desk:p-12">
        <BaseSectionHeading :title="title" :lead="home.contact_lead" />
        <div class="mt-8 flex items-start gap-3">
          <PhMapPin :size="22" class="mt-0.5 shrink-0 text-fg" />
          <div class="flex flex-col items-start gap-1">
            <BaseExternalLink :href="site.map_directions_url" class="text-accent-text underline-offset-4 hover:underline">{{ site.address }}</BaseExternalLink>
            <BaseButton variant="text" :href="site.map_directions_url">Get directions</BaseButton>
          </div>
        </div>
        <BaseButton variant="text" :href="site.tel_href" class="mt-2">
          <PhPhone class="shrink-0" />
          Call {{ site.phone_display }}
        </BaseButton>
        <p class="mt-8 font-semibold">Opening hours</p>
        <SectionVisitHoursBadge />
        <SectionVisitHoursTable class="mt-3" />
        <LayoutMainAction class="mt-8 w-full desk:w-auto" />
      </div>
      <div v-motion="revealFade(0.12)" class="desk:col-span-6">
        <div ref="mapFrame" class="relative aspect-square overflow-hidden rounded-none bg-surface desk:aspect-auto desk:h-full desk:min-h-[480px]">
          <div class="absolute inset-0 grid place-content-center justify-items-center gap-2">
            <PhMapPin :size="32" class="text-fg" />
            <BaseExternalLink :href="site.map_directions_url" class="text-muted underline">Open in Google Maps</BaseExternalLink>
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
