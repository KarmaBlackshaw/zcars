<script setup lang="ts">
import { PARTNERS } from "@/types";

defineOptions({ name: "HomePartners" });

const names = PARTNERS.map((partner) => partner.name);
const sentence = `We work with products from ${names.slice(0, -1).join(", ")} and ${names.at(-1)}.`;
const copies = [1, 2, 3, 4];
const marquee = { animate: { x: ["0%", "-50%"] }, transition: { duration: 45, repeat: Infinity, ease: "linear" } };
</script>

<template>
  <section aria-label="Products we use" class="border-y border-line py-10 desk:py-14">
    <BaseContainer class="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
      <BaseEyebrow>Products we trust</BaseEyebrow>
      <p class="max-w-[60ch] text-small text-muted">{{ sentence }}</p>
    </BaseContainer>
    <div class="overflow-hidden bg-white py-5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
      <div v-motion="marquee" class="flex w-max items-center">
        <template v-for="copy in copies" :key="copy">
          <img
            v-for="partner in PARTNERS"
            :key="`${copy}-${partner.name}`"
            :src="partner.logo"
            :alt="copy === 1 ? partner.name : ''"
            :aria-hidden="copy !== 1"
            :width="partner.width"
            :height="partner.height"
            loading="lazy"
            class="mx-8 h-12 w-40 object-contain desk:h-14 desk:w-48"
          />
        </template>
      </div>
    </div>
  </section>
</template>
