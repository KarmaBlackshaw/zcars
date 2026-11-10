<script setup lang="ts">
import { home, services } from "virtual:content";

import polish from "@/assets/images/polish.webp";
import { sectionClasses } from "@/constants/section";

defineOptions({ name: "HomeServices" });
</script>

<template>
  <section v-if="services.length" id="services" :class="sectionClasses">
    <BaseContainer>
      <div v-motion="revealFade()">
        <BaseSectionHeading :title="home.services_title" :lead="home.services_lead" />
      </div>
      <div class="mt-12 grid gap-10 desk:mt-14 desk:grid-cols-12 desk:gap-x-8">
        <ul class="border-t border-line desk:col-span-7">
          <li v-for="(service, index) in services" :key="service.slug" v-motion="stagger(index)">
            <ServiceRow :service="service" />
          </li>
        </ul>
        <div v-motion="revealFade(0.12)" class="max-desk:max-w-photo desk:col-span-5">
          <img :src="polish" alt="Machine polishing on red paint" loading="lazy" class="aspect-[4/5] w-full rounded-none bg-surface object-cover" />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
