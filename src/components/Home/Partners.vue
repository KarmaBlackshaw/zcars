<script setup lang="ts">
import { home, partners } from "virtual:content";

defineOptions({ name: "HomePartners" });

const copies = [
  { id: 1, isDuplicate: false },
  { id: 2, isDuplicate: true },
];
</script>

<template>
  <section v-if="partners.length" aria-label="Products we use" class="border-y border-line bg-surface py-6">
    <BaseContainer v-if="home.partners_title">
      <p class="text-micro font-semibold text-muted">{{ home.partners_title }}</p>
    </BaseContainer>
    <div class="group mt-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        class="flex w-max items-center group-hover:[animation-play-state:paused] motion-safe:animate-marquee motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center"
      >
        <div
          v-for="copy in copies"
          :key="copy.id"
          :aria-hidden="copy.isDuplicate || undefined"
          :inert="copy.isDuplicate"
          :class="['flex items-center motion-reduce:flex-wrap motion-reduce:justify-center', copy.isDuplicate && 'motion-reduce:hidden']"
        >
          <img
            v-for="partner in partners"
            :key="partner.slug"
            :src="partner.logo"
            :alt="partner.name"
            loading="lazy"
            class="mx-8 h-10 w-32 object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 desk:h-12 desk:w-40"
          />
        </div>
      </div>
    </div>
  </section>
</template>
