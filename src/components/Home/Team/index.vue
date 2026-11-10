<script setup lang="ts">
import { home } from "virtual:content";

defineOptions({ name: "HomeTeam" });
</script>

<template>
  <section id="team" aria-labelledby="team-title" class="scroll-mt-nav border-t border-line py-16 desk:py-20">
    <BaseContainer class="grid gap-8 desk:grid-cols-12 desk:items-center desk:gap-10">
      <figure class="desk:col-span-4">
        <img :src="home.team_image" :alt="home.team_title" loading="lazy" class="aspect-[4/3] w-full rounded-card bg-surface object-cover" />
        <figcaption v-if="home.team_caption" class="mt-2 text-micro text-muted">{{ home.team_caption }}</figcaption>
      </figure>
      <div class="desk:col-span-8">
        <h2 id="team-title" class="max-w-[22ch] text-h3 desk:text-[1.75rem]">{{ home.team_title }}</h2>
        <p class="mt-3 max-w-[60ch] text-muted">{{ home.team_lead }}</p>
        <HomeTeamHiring />
      </div>
    </BaseContainer>
  </section>
</template>
