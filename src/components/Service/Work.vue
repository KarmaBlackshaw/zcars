<script setup lang="ts">
import type { TProject } from "@/types";

defineOptions({ name: "ServiceWork" });

const { projects } = defineProps<{ projects: TProject[] }>();

const openIndex = ref<number>();

function openProject(index: number) {
  openIndex.value = index;
}
</script>

<template>
  <section aria-labelledby="service-work-title" class="border-t border-line py-12 desk:py-16">
    <BaseContainer>
      <BaseSectionHeading id="service-work-title" title="Recent work" />
      <ul role="list" class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <li v-for="(project, index) in projects" :key="project.slug">
          <HomeProjectsCard :project="project" @open="openProject(index)" />
        </li>
      </ul>
    </BaseContainer>
    <HomeProjectsLightbox v-model="openIndex" :projects="projects" />
  </section>
</template>
