<script setup lang="ts">
import { faqs, home, projects, services, site } from "virtual:content";

defineOptions({ name: "IndexPage" });

const { heroProject, workProjects } = splitHomeProjects(projects);
</script>

<template>
  <main>
    <HomeHero :project="heroProject" />
    <SectionServices id="services" :title="home.services_title" :lead="home.services_lead" :services="services" />
    <HomePromo />
    <SectionWork :title="home.work_title" :projects="workProjects">
      <template #action>
        <BaseButton variant="ghost" size="sm" :href="site.facebook_url">See more on Facebook</BaseButton>
      </template>
    </SectionWork>
    <HomeProcess />
    <HomeReviews />
    <SectionVisit :title="home.contact_title" />
    <SectionFaq :title="home.faq_title" :items="faqs" />
    <HomeTeam />
    <SectionClose />
  </main>
</template>
