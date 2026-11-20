<script setup lang="ts">
import { home, partners } from "virtual:content";

defineOptions({ name: "HomePartners" });

const hasPartners = partners.length > 0;
</script>

<template>
  <section v-if="hasPartners" class="kit-away scroll-mt-nav py-16 desk:py-24" data-qa="partners">
    <BaseContainer>
      <h2 v-if="home.partners_title">{{ home.partners_title }}</h2>
      <ul class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 desk:mt-12 desk:grid-cols-8 desk:gap-4">
        <li
          v-for="partner in partners"
          :key="partner.name"
          class="stitch grid h-[72px] place-items-center rounded-md border border-bluishWhite bg-white px-4"
          :data-qa="`partner-${partner.name}`"
        >
          <img :src="partner.logo" :alt="partner.name" loading="lazy" class="max-h-8 w-auto max-w-full" />
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
