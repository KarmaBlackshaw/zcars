<script setup lang="ts">
import partners from "@/assets/images/partners.webp";
import { PARTNER_NAMES } from "@/types";

defineOptions({ name: "HomePartners" });

const lastPartner = PARTNER_NAMES[PARTNER_NAMES.length - 1];
const sentence = `We work with products from ${PARTNER_NAMES.slice(0, -1).join(", ")} and ${lastPartner}.`;
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
      <div v-motion="marquee" class="flex w-max">
        <img
          v-for="copy in copies"
          :key="copy"
          :src="partners"
          :alt="copy === 1 ? 'Logos: Menzerna, 3M, Solar Gard, Mobil, Anzahl, MTX Microtex, Timeless, Rocci Automotive Refinish' : ''"
          :aria-hidden="copy !== 1"
          width="1408"
          height="125"
          loading="lazy"
          class="h-10 w-auto px-8 desk:h-12"
        />
      </div>
    </div>
  </section>
</template>
