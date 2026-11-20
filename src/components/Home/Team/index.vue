<script setup lang="ts">
import { home } from "virtual:content";
import { gridClasses, sectionClasses } from "@/constants/section";

defineOptions({ name: "HomeTeam" });
</script>

<template>
  <section id="team" class="kit-mesh" :class="sectionClasses" data-qa="team">
    <BaseContainer>
      <div :class="[gridClasses, 'gap-y-12 desk:items-center']">
        <div class="order-2 desk:order-1 desk:col-span-5">
          <div class="relative aspect-[4/5] overflow-clip rounded-lg max-desk:max-w-photo">
            <BaseImage
              :src="home.team_image"
              :alt="home.team_title"
              sizes="(min-width: 900px) 40vw, (min-width: 540px) 540px, 100vw"
              loading="lazy"
              class="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
        <div class="order-1 desk:order-2 desk:col-span-6 desk:col-start-7">
          <BaseSectionHeading :title="home.team_title" :lead="home.team_lead" />
          <HomeTeamHiring />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
