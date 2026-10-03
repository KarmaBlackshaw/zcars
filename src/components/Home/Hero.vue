<script setup lang="ts">
import { PhMapPin, PhPhone } from "@phosphor-icons/vue";
import logo from "@/assets/images/logo.webp";
import montero from "@/assets/images/montero.webp";
import { BUSINESS_NAME, PHONE_DISPLAY, PHONE_HREF, SERVICES } from "@/types";

defineOptions({ name: "HomeHero" });

const serviceTags = SERVICES.flatMap((service) => service.tags);
</script>

<template>
  <section>
    <BaseContainer class="grid gap-10 pb-12 pt-10 desk:min-h-[calc(100dvh-theme(spacing.nav))] desk:grid-cols-12 desk:gap-8 desk:py-10">
      <div class="flex flex-col desk:col-span-7 desk:pr-8">
        <div class="desk:my-auto">
          <BaseEyebrow v-motion="enter()">
            <PhMapPin aria-hidden="true" class="shrink-0" />
            Sagkahan, Tacloban City
          </BaseEyebrow>
          <h1 v-motion="enter(0.09)" class="mt-6 max-w-[13ch]">Paint, protection and shine. <em class="not-italic text-accent-text">One shop.</em></h1>
          <p v-motion="enter(0.18)" class="mt-6 max-w-[48ch] text-lead text-muted">
            Repaint, body repair, tint, undercoating, ceramic coating and full detailing, done under one roof by the Zcars crew.
          </p>
          <div v-motion="enter(0.27)" class="mt-9 flex flex-wrap gap-3">
            <BaseButton :href="PHONE_HREF">
              <PhPhone aria-hidden="true" class="shrink-0" />
              Call {{ PHONE_DISPLAY }}
            </BaseButton>
            <BaseButton variant="ghost" href="#services">See services</BaseButton>
          </div>
        </div>
        <ul
          role="list"
          aria-label="What we do"
          v-motion="enter(0.36)"
          class="mt-12 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 text-small text-muted sm:grid-cols-4"
        >
          <li v-for="tag in serviceTags" :key="tag" class="flex items-center gap-2">
            <span aria-hidden="true" class="size-1 shrink-0 rounded-full bg-accent-text"></span>
            {{ tag }}
          </li>
        </ul>
      </div>
      <figure
        v-motion="enter(0.18)"
        class="relative aspect-[4/5] max-h-[80dvh] overflow-hidden rounded-card bg-surface desk:col-span-5 desk:aspect-auto desk:max-h-none"
      >
        <img
          :src="montero"
          alt="Black Mitsubishi Montero Sport with a fresh, glossy detail outside the Zcars garage"
          width="540"
          height="960"
          fetchpriority="high"
          class="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden="true"
          class="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl border border-white/10 bg-inkBlack/55 p-3 text-sportyWhite shadow-[inset_0_1px_0_theme(colors.white/10%)] backdrop-blur-md"
        >
          <img :src="logo" alt="" width="40" height="40" class="size-10 rounded-full" />
          <div class="leading-tight">
            <strong class="block text-small font-semibold">{{ BUSINESS_NAME }}</strong>
            <span class="text-micro text-ghost">Sagkahan, Tacloban City</span>
          </div>
        </div>
      </figure>
    </BaseContainer>
  </section>
</template>
