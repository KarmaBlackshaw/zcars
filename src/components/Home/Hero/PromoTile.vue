<script setup lang="ts">
import { PhArrowDown } from "@phosphor-icons/vue";

import type { TPromo } from "@/types";

defineOptions({ name: "HomeHeroPromoTile" });

const { promo } = defineProps<{ promo: TPromo }>();
</script>

<template>
  <BaseTile href="#promo" tone="accent" padding="md" class="flex flex-col justify-between gap-6">
    <div>
      <p v-if="promo.price_label != null" class="text-tile-price tabular-nums">{{ promo.price_label }}</p>
      <p class="mt-2 text-h3">{{ promo.title }}</p>
    </div>
    <span class="inline-flex items-center gap-2 text-small font-semibold">
      See what the promo includes
      <PhArrowDown class="shrink-0" />
    </span>
  </BaseTile>
</template>
