<script setup lang="ts">
import { home, services } from "virtual:content";

defineOptions({ name: "HomeServices" });

const STAGGER_CAP = 3;

const copy = home.services;

const deskColumnClasses: Record<number, string> = {
  1: "desk:grid-cols-1",
  2: "desk:grid-cols-2",
  3: "desk:grid-cols-3",
};

const deskColumns = deskColumnClasses[services.length] ?? "desk:grid-cols-4";

function revealAt(index: number) {
  return revealFade(Math.min(index, STAGGER_CAP) * 0.09);
}
</script>

<template>
  <section v-if="services.length" id="services" aria-labelledby="services-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer>
      <BaseSectionHeading id="services-title" v-motion="reveal()" :title="copy.title" :eyebrow="copy.eyebrow" :lead="copy.lead" />
      <ul role="list" :class="['mt-12 grid gap-4 sm:grid-cols-2', deskColumns]">
        <li v-for="(service, index) in services" :key="service.slug" v-motion="revealAt(index)">
          <HomeServicesCard :service="service" />
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
