<script setup lang="ts">
import { PhArrowUpRight } from "@phosphor-icons/vue";
import { faqs, home, projects, services, site } from "virtual:content";

defineOptions({ name: "IndexPage" });

const { heroProject, compareProject, workProjects } = splitHomeProjects(projects);
const { featuredPromo } = usePromos();
</script>

<template>
  <main>
    <HomeHero :project="heroProject" />
    <ServiceRoster :services="services" />
    <SectionWork :title="home.work_title" :projects="workProjects">
      <template #action>
        <BaseButton variant="text" :href="site.facebook_url" data-qa="work-facebook">
          See more on Facebook
          <PhArrowUpRight :size="16" weight="bold" class="shrink-0" />
        </BaseButton>
      </template>
      <template v-if="featuredPromo" #feature>
        <HomePromoCard :promo="featuredPromo" />
      </template>
    </SectionWork>
    <HomeProcess :project="compareProject" />
    <HomePartners />
    <HomeReviews />
    <HomeTeam />
    <SectionFaq :title="home.faq_title" :items="faqs" />
    <SectionVisit :title="home.contact_title" />
  </main>
</template>
