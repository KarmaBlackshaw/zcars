<script setup lang="ts">
import { PhHammer, PhPaintRoller, PhShieldCheck, PhSparkle, PhSprayBottle, PhSunDim, PhUmbrella, PhWrench } from "@phosphor-icons/vue";
import type { Component } from "vue";

import type { TService, TServiceIcon } from "@/types";

defineOptions({ name: "ServiceStrip" });

const { services, activeSlug } = defineProps<{ services: TService[]; activeSlug?: string }>();

const icons: Record<TServiceIcon, Component> = {
  "spray-bottle": PhSprayBottle,
  sparkle: PhSparkle,
  "shield-check": PhShieldCheck,
  hammer: PhHammer,
  "paint-roller": PhPaintRoller,
  wrench: PhWrench,
  "sun-dim": PhSunDim,
  umbrella: PhUmbrella,
};

const tileBaseClass =
  "group flex min-h-[3.625rem] items-center gap-3 px-4 py-2 text-left transition-colors duration-200 md:min-h-[6.25rem] md:flex-col md:justify-center md:gap-2 md:px-2 md:text-center";
const iconBaseClass = "shrink-0 text-accent transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5";

function tileClass(slug: string) {
  const stateClass = slug === activeSlug ? "bg-night text-white" : "text-fg hover:bg-night hover:text-white";

  return [tileBaseClass, stateClass];
}

function iconClass(slug: string) {
  const stateClass = slug === activeSlug ? "text-glow" : "group-hover:text-glow";

  return [iconBaseClass, stateClass];
}
</script>

<template>
  <section v-if="services.length > 0" id="services" class="relative z-10 -mt-10 scroll-mt-nav">
    <BaseContainer>
      <ul class="mx-auto grid max-w-[76rem] grid-cols-2 gap-px overflow-hidden rounded-xl bg-line shadow-tile md:grid-cols-4 desk:grid-cols-8">
        <li v-for="service in services" :key="service.slug" class="bg-surface">
          <a :href="getServicePath(service.slug)" :class="tileClass(service.slug)">
            <component :is="icons[service.icon]" :size="24" :class="iconClass(service.slug)" />
            <span class="font-display text-label uppercase italic">{{ service.title }}</span>
          </a>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
