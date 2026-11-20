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

  return promo.price_label != null ? `${promo.price_label} ${title} promo` : `${title} promo`;
});

const phoneText = computed(() => {
  const promo = featuredPromo.value;

  return promo?.price_label != null ? `${promo.price_label} promo` : "Promo";
});
</script>

<template>
  <div class="kit-navy h-8 text-small desk:h-9">
    <BaseContainer class="flex h-full items-center justify-between gap-3">
      <div class="flex items-center gap-5">
        <HoursStatus />
        <span class="hidden whitespace-nowrap text-blueCream xl:inline">{{ site.locality }}</span>
        <a :href="site.tel_href" class="hidden whitespace-nowrap text-blueCream transition-colors hover:text-white xl:inline" data-qa="utility-call"
          >Call {{ site.phone_display }}</a
        >
      </div>
      <a v-if="featuredPromo != null" :href="`/#${PROMO_ANCHOR}`" class="group shrink-0" data-qa="utility-promo">
        <BasePatch tone="accent">
          <span class="hidden xl:inline">{{ deskText }}</span>
          <span class="xl:hidden">{{ phoneText }}</span>
          <PhArrowRight :size="11" weight="bold" class="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        </BasePatch>
      </a>
    </BaseContainer>
  </div>
</template>
