<script setup lang="ts">
defineOptions({ name: "QuoteDrawer" });

const quoteDrawer = useQuoteDrawer();
</script>

<template>
  <BaseDrawer :open="quoteDrawer.isOpen.value" title="Get a price from a photo" @update:open="quoteDrawer.close">
    <p class="text-muted">Tell us about your car. A photo helps us price it faster.</p>
    <div class="mt-6">
      <QuoteForm />
    </div>
  </BaseDrawer>
</template>
