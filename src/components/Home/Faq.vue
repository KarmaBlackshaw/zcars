<script setup lang="ts">
import { faqs, home } from "virtual:content";

defineOptions({ name: "HomeFaq" });
</script>

<template>
  <section v-if="faqs.length" id="faq" aria-labelledby="faq-title" class="scroll-mt-nav py-16 desk:py-24">
    <BaseContainer class="max-w-3xl">
      <BaseSectionHeading id="faq-title" :title="home.faq_title" />
      <BaseFaqList :items="faqs" class="mt-10" />
    </BaseContainer>
  </section>
</template>
