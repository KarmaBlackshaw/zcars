<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";

defineOptions({ name: "LayoutPromoStrip" });

const { activePromos } = usePromos();
const dismissedKey = useSessionStorage("zcars-promo-dismissed", "", { initOnMounted: true });

const promoKey = computed(() => activePromos.value.map((promo) => promo.title).join("|"));
const firstPromo = computed(() => activePromos.value[0]);
const isVisible = computed(() => firstPromo.value != null && dismissedKey.value !== promoKey.value);
const text = computed(() => (firstPromo.value?.price_label ? `${firstPromo.value.title} · ${firstPromo.value.price_label}` : firstPromo.value?.title));
const linkLabel = computed(() => (activePromos.value.length > 1 ? `See all ${activePromos.value.length} promos` : "See promo"));

function dismiss() {
  dismissedKey.value = promoKey.value;
}
</script>

<template>
  <aside v-if="isVisible" aria-label="Announcement" class="bg-accent text-micro text-white">
    <BaseContainer class="flex items-center gap-3 py-2">
      <p class="min-w-0 flex-1">
        {{ text }}
        <a href="#promos" class="font-semibold underline underline-offset-2 focus-visible:outline-white">{{ linkLabel }}</a>
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        class="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-white"
        @click="dismiss"
      >
        <PhX aria-hidden="true" />
      </button>
    </BaseContainer>
  </aside>
</template>
