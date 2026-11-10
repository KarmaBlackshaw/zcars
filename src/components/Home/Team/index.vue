<script setup lang="ts">
import { home } from "virtual:content";
import { ruledSectionClasses } from "@/constants/section";

defineOptions({ name: "HomeTeam" });
</script>

<template>
  <section id="team" :class="ruledSectionClasses">
    <BaseContainer class="grid gap-8 desk:grid-cols-12 desk:items-start desk:gap-x-8">
      <figure v-motion="revealFade(0.08)" class="order-2 max-desk:max-w-photo desk:order-1 desk:col-span-5">
        <img :src="home.team_image" :alt="home.team_title" loading="lazy" class="aspect-[4/5] w-full rounded-none bg-surface object-cover" />
      </figure>
      <div v-motion="revealFade()" class="order-1 desk:order-2 desk:col-span-6 desk:col-start-7">
        <h2>{{ home.team_title }}</h2>
        <p class="mt-4 max-w-[44ch] text-lead text-muted">{{ home.team_lead }}</p>
        <HomeTeamHiring />
      </div>
    </BaseContainer>
  </section>
</template>
