<script setup lang="ts">
import { home } from "virtual:content";
import { gridClasses, sectionClasses } from "@/constants/section";

defineOptions({ name: "HomeTeam" });
</script>

<template>
  <section id="team" :class="sectionClasses">
    <BaseContainer>
      <div :class="[gridClasses, 'desk:items-center']">
        <div class="order-2 desk:order-1 desk:col-span-5">
          <div class="reveal relative aspect-[4/5] overflow-hidden rounded-2xl shadow-tile max-desk:max-w-photo">
            <BaseImage
              :src="home.team_image"
              :alt="home.team_title"
              sizes="(min-width: 900px) 40vw, (min-width: 540px) 540px, 100vw"
              loading="lazy"
              class="size-full object-cover"
            />
            <BaseImageCaption v-if="home.team_caption">
              <p class="font-display text-card-title uppercase italic">{{ home.team_caption }}</p>
            </BaseImageCaption>
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
