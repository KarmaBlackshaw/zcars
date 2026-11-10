<script setup lang="ts">
import { sectionClasses } from "@/constants/section";
import type { TProject } from "@/types";

defineOptions({ name: "SectionWork" });

const { projects } = defineProps<{ title: string; projects: TProject[] }>();

defineSlots<{ action?(): unknown }>();

const PAGE_SIZE = 8;
const PHONE_CAP = 4;
const STAGGER_CAP = 3;

const visibleCount = ref(PAGE_SIZE);
const hasExpanded = ref(false);
const openIndex = ref<number>();
const returnFocusTo = shallowRef<HTMLElement>();

const visibleProjects = computed(() => projects.slice(0, visibleCount.value));
const hasMorePages = computed(() => visibleCount.value < projects.length);
const isPhoneCapped = computed(() => !hasExpanded.value && projects.length > PHONE_CAP);
const hasMoreWork = computed(() => hasMorePages.value || isPhoneCapped.value);
const moreClass = computed(() => (projects.length <= PAGE_SIZE ? "desk:hidden" : ""));

function itemClass(index: number) {
  return index >= PHONE_CAP && !hasExpanded.value ? "max-desk:hidden" : "";
}

function openProject(index: number, trigger: HTMLElement) {
  returnFocusTo.value = trigger;
  openIndex.value = index;
}

function showMore() {
  hasExpanded.value = true;

  if (hasMorePages.value) {
    visibleCount.value += PAGE_SIZE;
  }
}
</script>

<template>
  <section v-if="projects.length > 0" id="work" :class="sectionClasses">
    <BaseContainer>
      <div v-motion="revealFade()" class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <BaseSectionHeading :title="title" />
        <slot name="action"></slot>
      </div>
      <ul class="mt-12 grid grid-cols-2 gap-3 desk:mt-14 desk:grid-cols-4 desk:gap-6">
        <li v-for="(project, index) in visibleProjects" :key="project.slug" v-motion="stagger(index, STAGGER_CAP)" :class="itemClass(index)">
          <SectionWorkCard :project="project" @open="openProject(index, $event)" />
        </li>
      </ul>
      <div v-if="hasMoreWork" class="mt-10 text-center" :class="moreClass">
        <BaseButton variant="ghost" size="sm" @click="showMore">Show more work</BaseButton>
      </div>
    </BaseContainer>
    <SectionWorkLightbox v-model="openIndex" :projects="projects" :return-focus-to="returnFocusTo" />
  </section>
</template>
