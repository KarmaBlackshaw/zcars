<script setup lang="ts">
import type { TService } from "@/types";

defineOptions({ name: "ServiceRoster" });

const { services, activeSlug, title } = defineProps<{ services: TService[]; activeSlug?: string; title?: string }>();

const tileBaseClass = "relative flex h-full flex-col gap-3 border-b border-r border-bluishWhite px-3 pb-5 pt-6 md:px-5";
const tileLinkClass = `${tileBaseClass} transition-[background-color,color,transform,box-shadow] duration-200 ease-settle hover:z-10 hover:bg-blueGrotto hover:text-white hover:shadow-lift hover:[--press:var(--coveGray)] motion-safe:hover:-translate-y-0.5`;
const tileActiveClass = `${tileBaseClass} bg-blueGrotto text-white [--press:var(--coveGray)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-electrifyingChartreuse`;
</script>

<template>
  <section
    v-if="services.length > 0"
    id="services"
    class="kit-away scroll-mt-nav"
    :class="title ? 'py-16 desk:py-28' : 'py-10 desk:py-14'"
    data-qa="service-roster"
  >
    <BaseContainer>
      <h2 v-if="title" class="mb-10 desk:mb-14">{{ title }}</h2>
      <ul class="grid grid-cols-2 border-l border-t border-bluishWhite md:grid-cols-4">
        <li v-for="service in services" :key="service.slug">
          <div v-if="service.slug === activeSlug" :class="tileActiveClass" :data-qa="`roster-tile-${service.slug}`">
            <BaseNumeral :value="formatServiceNumber(service.position)" />
            <span class="name-line tracking-[.12em]">{{ service.title }}</span>
          </div>
          <a v-else :href="getServicePath(service.slug)" :class="tileLinkClass" :data-qa="`roster-tile-${service.slug}`">
            <BaseNumeral :value="formatServiceNumber(service.position)" />
            <span class="name-line tracking-[.12em]">{{ service.title }}</span>
          </a>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
