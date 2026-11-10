<script setup lang="ts">
import { faqs, home, projects, site } from "virtual:content";

defineOptions({ name: "IndexPage" });

const { heroProjects, workProjects } = splitHomeProjects(projects);
</script>

<template>
  <main id="main" tabindex="-1" class="focus:outline-none">
    <HomeHero :projects="heroProjects" />
    <HomeServices />
    <HomePromos />
    <SectionWork :title="home.work_title" :projects="workProjects">
      <template #action>
        <BaseButton variant="text" :href="site.facebook_url">See more on Facebook</BaseButton>
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
