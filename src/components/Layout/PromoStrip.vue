<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { promo } from "virtual:content";

defineOptions({ name: "LayoutPromoStrip" });

const isExpired = ref(false);
const dismissedText = useSessionStorage("zcars-promo-dismissed", "", { initOnMounted: true });

const isVisible = computed(() => promo.is_enabled && !isExpired.value && dismissedText.value !== promo.text);

const hasLink = promo.link_label != null && promo.link_href != null;
const externalHref = promo.link_href?.startsWith("https://") ? promo.link_href : undefined;
const linkClass = "font-semibold underline underline-offset-2 focus-visible:outline-white";

onMounted(() => {
  isExpired.value = promo.ends_on != null && promo.ends_on < getTodayInManila();
});

function dismiss() {
  dismissedText.value = promo.text;
}
</script>

<template>
  <aside v-if="isVisible" aria-label="Announcement" class="bg-accent text-micro text-white">
    <BaseContainer class="flex items-center gap-3 py-2">
      <p class="min-w-0 flex-1">
        {{ promo.text }}
        <template v-if="hasLink">
          <BaseExternalLink v-if="externalHref" :href="externalHref" :class="linkClass">{{ promo.link_label }}</BaseExternalLink>
          <a v-else :href="promo.link_href" :class="linkClass">{{ promo.link_label }}</a>
        </template>
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
