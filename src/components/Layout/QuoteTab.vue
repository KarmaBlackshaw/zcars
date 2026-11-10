<script setup lang="ts">
import { PhNotePencil } from "@phosphor-icons/vue";
import { services } from "virtual:content";

defineOptions({ name: "LayoutQuoteTab" });

const route = useRoute();
const quoteDrawer = useQuoteDrawer();

const serviceTitle = computed(() => {
  const { params } = route;

  if (!("slug" in params) || typeof params.slug !== "string") {
    return undefined;
  }

  const { slug } = params;

  return services.find((service) => service.slug === slug)?.title;
});

function openQuote() {
  quoteDrawer.open(serviceTitle.value);
}
</script>

<template>
  <button
    type="button"
    class="fixed right-0 top-1/2 z-20 flex w-6 -translate-y-1/2 rotate-180 items-center justify-center gap-2 whitespace-nowrap rounded-r-md bg-accent px-0 py-3 font-display text-label font-bold uppercase italic text-white shadow-lift transition-[filter] duration-300 ease-settle [writing-mode:vertical-rl] hover:brightness-110 desk:w-auto desk:rounded-r-lg desk:px-2.5 desk:py-5 desk:text-button"
    @click="openQuote"
  >
    <PhNotePencil class="size-3.5 rotate-180 desk:size-5" weight="bold" />
    Get a free quote
  </button>
</template>
