<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";
import { faqs, home } from "virtual:content";

defineOptions({ name: "HomeFaq" });
</script>

<template>
  <section v-if="faqs.length" id="faq" aria-labelledby="faq-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer class="max-w-3xl">
      <BaseSectionHeading id="faq-title" :title="home.faq.title" :eyebrow="home.faq.eyebrow" />
      <div class="mt-10 divide-y divide-line border-y border-line">
        <details v-for="faq in faqs" :key="faq.question" class="group">
          <summary class="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
            {{ faq.question }}
            <PhCaretDown aria-hidden="true" class="shrink-0 group-open:rotate-180 motion-safe:transition-transform" />
          </summary>
          <p class="whitespace-pre-line pb-5 text-muted">{{ faq.answer }}</p>
        </details>
      </div>
    </BaseContainer>
  </section>
</template>
