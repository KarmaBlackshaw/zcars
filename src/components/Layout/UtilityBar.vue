<script setup lang="ts">
import { PhArrowRight } from "@phosphor-icons/vue";
import { site } from "virtual:content";

import { PROMO_ANCHOR } from "@/constants/promo";

defineOptions({ name: "LayoutUtilityBar" });

const { featuredPromo } = usePromos();

const deskText = computed(() => {
  const promo = featuredPromo.value;

  if (promo == null) {
    return "";
  }

  const title = toMidSentence(promo.title);

  return promo.price_label != null ? `${promo.price_label} ${title}` : title;
});

const phoneText = computed(() => {
  const promo = featuredPromo.value;

  return promo?.price_label != null ? `${promo.price_label} promo` : "Promo";
});
</script>

<template>
  <div class="night h-8 bg-night text-micro desk:h-9">
    <BaseContainer class="flex h-full items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <HoursStatus />
        <span class="hidden desk:inline">{{ site.locality }}</span>
        <a :href="site.tel_href" class="hidden hover:text-glow desk:inline">Call {{ site.phone_display }}</a>
      </div>
      <a
        v-if="featuredPromo != null"
        :href="`/#${PROMO_ANCHOR}`"
        class="inline-flex items-center gap-1 font-display font-black uppercase italic text-hot hover:brightness-110"
      >
        <span class="hidden desk:inline">{{ deskText }}</span>
        <span class="desk:hidden">{{ phoneText }}</span>
        <PhArrowRight :size="12" class="shrink-0" />
      </a>
    </BaseContainer>
  </div>
</template>
