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
          <BaseTile padding="none" class="reveal aspect-[4/5] max-desk:max-w-photo">
            <img :src="home.team_image" :alt="home.team_title" loading="lazy" class="size-full object-cover" />
          </BaseTile>
        </div>
        <div class="order-1 desk:order-2 desk:col-span-6 desk:col-start-7">
          <BaseSectionHeading :title="home.team_title" :lead="home.team_lead" />
          <HomeTeamHiring />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
