<script setup lang="ts">
import { PhMapPin, PhMessengerLogo, PhPhone, PhShieldCheck } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";

defineOptions({ name: "HomeContact" });

const quoteDrawer = useQuoteDrawer();

const mapTitle = `Map to ${site.name}, ${site.locality}`;

function openQuote() {
  quoteDrawer.open();
}
</script>

<template>
  <section id="contact" aria-labelledby="contact-title" class="scroll-mt-nav border-t border-line py-16 desk:py-24">
    <BaseContainer class="grid gap-12 desk:grid-cols-12 desk:gap-8">
      <div v-motion="reveal()" class="desk:col-span-5">
        <BaseSectionHeading id="contact-title" :title="home.contact_title" :lead="home.contact_lead" class="[&>p]:max-w-[44ch]" />
        <a
          :href="site.tel_href"
          class="group mt-8 inline-flex items-center gap-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-heading transition-colors [font-stretch:125%] hover:text-accent-text"
        >
          <span
            class="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-300 ease-settle motion-safe:group-hover:-rotate-12"
          >
            <PhPhone :size="22" weight="fill" />
          </span>
          {{ site.phone_display }}
        </a>
        <div class="mt-6 flex flex-wrap gap-3">
          <BaseButton :href="site.messenger_url">
            <PhMessengerLogo class="shrink-0" />
            Message us
          </BaseButton>
          <BaseButton variant="ghost" @click="openQuote">Get a quote</BaseButton>
        </div>
        <p v-if="home.reply_time" class="mt-3 text-small text-muted">{{ home.reply_time }}</p>
        <div class="mt-10 flex items-start gap-3">
          <PhMapPin :size="22" class="mt-0.5 shrink-0 text-accent-text" />
          <div>
            <p>{{ site.address }}</p>
            <BaseExternalLink :href="site.map_directions_url" class="inline-flex min-h-11 items-center font-semibold text-accent-text hover:underline">
              Get directions
            </BaseExternalLink>
          </div>
        </div>
        <div class="mt-6">
          <HomeHoursBadge />
          <HomeHoursTable class="mt-3" />
        </div>
        <div v-if="home.warranty_title" class="mt-8 flex items-start gap-3 rounded-card bg-surface p-4">
          <PhShieldCheck :size="24" class="shrink-0 text-accent-text" />
          <div>
            <strong class="block font-semibold">{{ home.warranty_title }}</strong>
            <span v-if="home.warranty_text" class="block text-small text-muted">{{ home.warranty_text }}</span>
          </div>
        </div>
      </div>
      <div v-motion="reveal(0.12)" class="desk:col-span-7">
        <div class="relative h-full min-h-[420px] overflow-hidden rounded-card border border-line bg-surface">
          <div class="absolute inset-0 grid place-content-center justify-items-center gap-2">
            <PhMapPin :size="32" class="text-accent-text" />
            <BaseExternalLink :href="site.map_directions_url" class="text-muted underline">Open in Google Maps</BaseExternalLink>
          </div>
          <iframe
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
