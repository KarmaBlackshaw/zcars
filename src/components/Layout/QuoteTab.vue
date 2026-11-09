<script setup lang="ts">
import { PhNotePencil } from "@phosphor-icons/vue";

defineOptions({ name: "LayoutQuoteTab" });

const quoteDrawer = useQuoteDrawer();

function openQuote() {
  quoteDrawer.open();
}
</script>

<template>
  <button
    type="button"
    class="fixed right-0 top-1/2 z-20 hidden -translate-y-1/2 rotate-180 items-center gap-2 rounded-r-xl bg-accent px-2.5 py-5 font-semibold text-white shadow-lg transition-colors [writing-mode:vertical-rl] hover:bg-brilliantBlue desk:flex"
    @click="openQuote"
  >
    <PhNotePencil :size="18" class="shrink-0 rotate-180" />
    Get a quote
  </button>
</template>
