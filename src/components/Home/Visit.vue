<script setup lang="ts">
import { PhFacebookLogo, PhMapPin, PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";

defineOptions({ name: "HomeVisit" });

const facts = [
  { icon: PhMessengerLogo, label: "Messenger", text: "Message us", href: site.messenger_url },
  { icon: PhMapPin, label: "Address", text: site.address, href: site.map_directions_url },
  { icon: PhFacebookLogo, label: "Facebook", text: site.name, href: site.facebook_url },
];

const mapTitle = `Map to ${site.name}, ${site.locality}`;
</script>

<template>
  <section id="visit" aria-labelledby="visit-title" class="scroll-mt-nav border-t border-line py-24 desk:py-32">
    <BaseContainer class="grid gap-12 desk:grid-cols-12 desk:gap-8">
      <div v-motion="reveal()" class="desk:col-span-5">
        <BaseSectionHeading id="visit-title" :title="home.visit.title" :eyebrow="home.visit.eyebrow" :lead="home.visit.lead" class="[&>p]:max-w-[44ch]" />
        <a
          :href="site.tel_href"
          class="group mt-10 inline-flex items-center gap-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-heading transition-colors [font-stretch:125%] hover:text-accent-text"
        >
          <span
            class="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-300 ease-settle motion-safe:group-hover:-rotate-12"
          >
            <PhPhone :size="22" weight="fill" aria-hidden="true" />
          </span>
          {{ site.phone_display }}
        </a>
        <div class="mt-4">
          <HomeHoursBadge />
        </div>
        <ul role="list" class="mt-10 divide-y divide-line border-y border-line">
          <li v-for="fact in facts" :key="fact.label" class="flex items-start gap-4 py-4">
            <component :is="fact.icon" :size="22" aria-hidden="true" class="mt-3 shrink-0 text-accent-text" />
            <div>
              <strong class="block text-micro font-semibold uppercase tracking-eyebrow text-muted">{{ fact.label }}</strong>
              <BaseExternalLink
                :href="fact.href"
                class="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent-text"
              >
                {{ fact.text }}
              </BaseExternalLink>
            </div>
          </li>
        </ul>
        <HomeHoursTable class="mt-10" />
      </div>
      <div v-motion="reveal(0.12)" class="desk:col-span-7">
        <div
          class="relative min-h-[420px] overflow-hidden rounded-card border border-line bg-surface focus-within:outline focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-accent-text desk:min-h-[580px]"
        >
          <div aria-hidden="true" class="absolute inset-0 grid place-content-center justify-items-center gap-2">
            <PhMapPin :size="32" class="text-accent-text" />
            <BaseExternalLink :href="site.map_directions_url" tabindex="-1" class="text-muted underline">Open in Google Maps</BaseExternalLink>
          </div>
          <iframe
            :src="site.map_embed_url"
            :title="mapTitle"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="absolute inset-0 size-full border-0"
          ></iframe>
        </div>
        <BaseExternalLink
          :href="site.map_directions_url"
          class="mt-3 inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent-text"
        >
          Get directions
        </BaseExternalLink>
      </div>
    </BaseContainer>
  </section>
</template>
