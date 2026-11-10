<script setup lang="ts">
import { PhFacebookLogo } from "@phosphor-icons/vue";
import { site } from "virtual:content";

import { sectionBodyClasses } from "@/constants/section";
import type { TProject } from "@/types";

defineOptions({ name: "SectionWork" });

const { title, projects } = defineProps<{ title: string; projects: TProject[] }>();

defineSlots<{ action?(): unknown }>();

const PAGE_SIZE = 8;

const visibleCount = ref(PAGE_SIZE);
const openIndex = ref<number>();

const visibleProjects = computed(() => projects.slice(0, visibleCount.value));
const hasMorePages = computed(() => visibleCount.value < projects.length);
const hasFeature = computed(() => projects.length >= 4);

function cellClass(index: number) {
  return index === 0 && hasFeature.value ? "col-span-2 aspect-[4/5] desk:row-span-2 desk:aspect-auto" : "aspect-[3/4]";
}

function showMore() {
  visibleCount.value += PAGE_SIZE;
}
</script>

<template>
  <BasePanel v-if="projects.length > 0" id="work">
    <div class="py-16 desk:py-32">
      <BaseSectionHeading :title="title" layout="split">
        <template v-if="$slots.action" #action><slot name="action"></slot></template>
      </BaseSectionHeading>
      <div :class="sectionBodyClasses">
        <ul class="grid grid-cols-2 gap-3 desk:grid-cols-4 desk:gap-4">
          <li v-for="(project, index) in visibleProjects" :key="project.slug" class="reveal" :class="cellClass(index)">
            <SectionWorkTile :project="project" @open="openIndex = index" />
          </li>
          <li class="reveal aspect-[3/4]">
            <BaseTile :href="site.facebook_url" padding="md" class="flex size-full flex-col justify-between">
              <p class="text-base font-semibold text-fg desk:text-h3">More of our finished cars are on the Zcars Facebook page.</p>
              <span class="inline-flex items-center gap-2 font-semibold text-link">
                <PhFacebookLogo :size="20" class="shrink-0" />
                See more on Facebook
              </span>
            </BaseTile>
          </li>
        </ul>
        <div v-if="hasMorePages" class="mt-10 text-center">
          <BaseButton variant="ghost" size="sm" @click="showMore">Show more work</BaseButton>
        </div>
      </div>
    </div>
    <SectionWorkLightbox v-model="openIndex" :projects="projects" />
  </BasePanel>
</template>
