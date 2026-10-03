<script setup lang="ts">
import { PhMapPin, PhPhone } from "@phosphor-icons/vue";
import { BUSINESS_NAME, MAP_DIRECTIONS_URL, MAP_EMBED_URL, PHONE_DISPLAY, PHONE_HREF, VISIT_FACTS, type TVisitFact } from "@/types";

defineOptions({ name: "HomeVisit" });

const linkAttrs = (fact: TVisitFact) => (fact.isExternal ? { target: "_blank", rel: "noopener" } : {});

const mapTitle = `Map to ${BUSINESS_NAME}, Sagkahan, Tacloban City`;
</script>

<template>
  <section id="visit" class="border-t border-line py-24 desk:py-32">
    <BaseContainer class="grid gap-12 desk:grid-cols-12 desk:gap-8">
      <div v-motion="reveal()" class="desk:col-span-5">
        <BaseEyebrow>Visit the garage</BaseEyebrow>
        <h2 class="mt-4">Drop by Sagkahan</h2>
        <p class="mt-5 max-w-[44ch] text-lead text-muted">Call ahead so we can have a bay ready for you.</p>
        <a
          :href="PHONE_HREF"
          class="group mt-10 inline-flex items-center gap-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-heading transition-colors [font-stretch:125%] hover:text-accent-text"
        >
          <span
            class="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-300 ease-settle motion-safe:group-hover:-rotate-12"
          >
            <PhPhone :size="22" weight="fill" aria-hidden="true" />
          </span>
          {{ PHONE_DISPLAY }}
        </a>
        <ul role="list" class="mt-10 divide-y divide-line border-y border-line">
          <li v-for="fact in VISIT_FACTS" :key="fact.label" class="flex items-start gap-4 py-5">
            <component :is="fact.icon" :size="22" aria-hidden="true" class="mt-0.5 shrink-0 text-accent-text" />
            <div>
              <strong class="block text-micro font-semibold uppercase tracking-eyebrow text-muted">{{ fact.label }}</strong>
              <a :href="fact.href" v-bind="linkAttrs(fact)" class="mt-1 inline-block underline decoration-line underline-offset-4 hover:decoration-accent-text">
                {{ fact.text }}<span v-if="fact.isExternal" class="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-motion="reveal(0.12)"
        class="relative min-h-[420px] overflow-hidden rounded-card border border-line bg-surface focus-within:outline focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-accent-text desk:col-span-7 desk:min-h-[580px]"
      >
        <div aria-hidden="true" class="absolute inset-0 grid place-content-center justify-items-center gap-2">
          <PhMapPin :size="32" class="text-accent-text" />
          <a :href="MAP_DIRECTIONS_URL" target="_blank" rel="noopener" tabindex="-1" class="text-muted underline">Open in Google Maps</a>
        </div>
        <iframe
          :src="MAP_EMBED_URL"
          :title="mapTitle"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="absolute inset-0 size-full border-0"
        ></iframe>
      </div>
    </BaseContainer>
  </section>
</template>
