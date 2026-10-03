<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";
import { promo } from "virtual:content";

defineOptions({ name: "LayoutPromoStrip" });

const isExpired = ref(false);
const dismissedText = useSessionStorage("zcars-promo-dismissed", "", { initOnMounted: true });

const { banner } = promo;
const link = banner?.link;
const externalHref = link?.href.startsWith("https://") ? link.href : undefined;
const linkClass = "font-semibold underline underline-offset-2 focus-visible:outline-white";

const isVisible = computed(() => banner != null && !isExpired.value && dismissedText.value !== banner.text);

onMounted(() => {
  isExpired.value = banner?.ends_on != null && banner.ends_on < getTodayInManila();
});

function dismiss() {
  dismissedText.value = banner?.text ?? "";
}
</script>

<template>
  <aside v-if="banner && isVisible" aria-label="Announcement" class="bg-accent text-micro text-white">
    <BaseContainer class="flex items-center gap-3 py-2">
      <p class="min-w-0 flex-1">
        {{ banner.text }}
        <template v-if="link">
          <BaseExternalLink v-if="externalHref" :href="externalHref" :class="linkClass">{{ link.label }}</BaseExternalLink>
          <a v-else :href="link.href" :class="linkClass">{{ link.label }}</a>
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
