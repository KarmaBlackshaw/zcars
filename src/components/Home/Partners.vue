<script setup lang="ts">
import { home, partners } from "virtual:content";

defineOptions({ name: "HomePartners" });

const hasPartners = partners.length > 0;
</script>

<template>
  <section v-if="hasPartners" class="scroll-mt-nav py-12 desk:py-16">
    <BaseContainer>
      <BaseSectionHeading v-if="home.partners_title" :title="home.partners_title" />
      <ul class="reveal mt-6 grid grid-cols-4 gap-3 desk:grid-cols-8 desk:gap-4">
        <li v-for="partner in partners" :key="partner.name" class="grid h-[72px] place-items-center rounded-xl border border-line bg-surface">
          <img :src="partner.logo" :alt="partner.name" loading="lazy" class="max-h-7 w-auto max-w-[70%] opacity-85 grayscale" />
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
