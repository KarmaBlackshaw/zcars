<script setup lang="ts">
import { PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutActionBar" });

const isHeroVisible = ref(true);
const isQuoteVisible = ref(false);
const heroActions = ref<HTMLElement>();
const quote = ref<HTMLElement>();

useIntersectionObserver(heroActions, ([entry]) => {
  isHeroVisible.value = entry?.isIntersecting ?? false;
});

useIntersectionObserver(quote, ([entry]) => {
  isQuoteVisible.value = entry?.isIntersecting ?? false;
});

const isHidden = computed(() => isHeroVisible.value || isQuoteVisible.value);
const barClass = computed(() => (isHidden.value ? "translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0" : ""));

onMounted(() => {
  heroActions.value = document.getElementById("hero-actions") ?? undefined;
  quote.value = document.getElementById("quote") ?? undefined;
});
</script>

<template>
  <nav
    aria-label="Quick contact"
    :inert="isHidden"
    :aria-hidden="isHidden"
    :class="barClass"
    class="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 backdrop-blur duration-300 ease-settle motion-safe:transition-transform motion-reduce:transition-opacity desk:hidden [@media(max-height:500px)]:hidden"
  >
    <div class="grid grid-cols-3 gap-2 px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2">
      <BaseButton size="sm" :href="site.tel_href" class="w-full">
        <PhPhone aria-hidden="true" class="shrink-0" />
        Call
      </BaseButton>
      <BaseButton variant="ghost" size="sm" :href="site.messenger_url" class="w-full">
        <PhMessengerLogo aria-hidden="true" class="shrink-0" />
        Message
      </BaseButton>
      <BaseButton variant="ghost" size="sm" href="#quote" class="w-full">Get a quote</BaseButton>
    </div>
  </nav>
</template>
