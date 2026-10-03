<script setup lang="ts">
import { home, partners } from "virtual:content";

defineOptions({ name: "HomePartners" });

const names = partners.map((partner) => partner.name);
const sentence = `We work with products from ${new Intl.ListFormat("en", { type: "conjunction" }).format(names)}.`;

const copies = [
  { id: 1, isDuplicate: false },
  { id: 2, isDuplicate: true },
];
</script>

<template>
  <section v-if="partners.length" aria-label="Products we use" class="border-y border-line py-10 desk:py-14">
    <BaseContainer class="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
      <BaseEyebrow v-if="home.partners.eyebrow">{{ home.partners.eyebrow }}</BaseEyebrow>
      <p class="max-w-[60ch] text-small text-muted">{{ sentence }}</p>
    </BaseContainer>
    <div class="group overflow-hidden bg-white py-5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
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
            class="mx-8 h-12 w-40 object-contain desk:h-14 desk:w-48"
          />
        </div>
      </div>
    </div>
  </section>
</template>
