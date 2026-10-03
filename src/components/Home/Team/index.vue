<script setup lang="ts">
import { home } from "virtual:content";

defineOptions({ name: "HomeTeam" });
</script>

<template>
  <section id="team" aria-labelledby="team-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer class="grid gap-12 desk:grid-cols-12 desk:items-center desk:gap-8">
      <figure v-motion="reveal()" class="desk:col-span-5">
        <div class="aspect-[4/5] overflow-hidden rounded-card bg-surface">
          <BaseParallaxImage :src="home.team.image" :alt="home.team.image_alt" loading="lazy" class="size-full object-cover" />
        </div>
        <figcaption v-if="home.team.caption" class="mt-3 text-sm text-muted">{{ home.team.caption }}</figcaption>
      </figure>
      <div class="desk:col-span-6 desk:col-start-7">
        <BaseSectionHeading
          id="team-title"
          v-motion="reveal()"
          :title="home.team.title"
          :eyebrow="home.team.eyebrow"
          :lead="home.team.lead"
          class="[&>h2]:max-w-[16ch] [&>p]:max-w-[52ch]"
        />
        <HomeTeamHiring />
      </div>
    </BaseContainer>
  </section>
</template>
