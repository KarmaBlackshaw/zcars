<script setup lang="ts">
import { PhArrowRight } from "@phosphor-icons/vue";
import { faqs, home, projects, services, site } from "virtual:content";

defineOptions({ name: "IndexPage" });

const { heroProject, compareProject, workProjects } = splitHomeProjects(projects);
const { featuredPromo } = usePromos();
</script>

<template>
  <main>
    <HomeHero :project="heroProject" />
    <ServiceStrip :services="services" />
    <SectionWork :title="home.work_title" :projects="workProjects">
      <template #action>
        <BaseButton variant="text" size="sm" :href="site.facebook_url">
          See more on Facebook
          <PhArrowRight class="shrink-0" />
        </BaseButton>
      </template>
      <template v-if="featuredPromo" #feature>
        <HomePromoCard :promo="featuredPromo" />
      </template>
    </SectionWork>
    <HomeProcess :project="compareProject" />
    <HomePartners class="bg-surface" />
    <SectionActions />
    <HomeReviews class="bg-surface" />
    <SectionVisit class="bg-surface" :title="home.contact_title" />
    <SectionFaq :title="home.faq_title" :items="faqs" />
    <HomeTeam class="bg-surface" />
  </main>
</template>
