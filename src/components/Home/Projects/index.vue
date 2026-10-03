<script setup lang="ts">
import { home, projects } from "virtual:content";

defineOptions({ name: "HomeProjects" });

const PAGE_SIZE = 6;
const STAGGER_CAP = 4;

const gridClasses = {
  single: "grid max-w-xl",
  pair: "grid grid-cols-2 gap-4",
  many: "grid grid-cols-2 gap-4 sm:grid-cols-3",
};

const copy = home.projects;
const gridId = useId();
const heading = useTemplateRef("heading");
const visibleCount = ref(PAGE_SIZE);
const openIndex = ref<number>();
const returnFocusTo = shallowRef<HTMLElement>();

const visibleProjects = computed(() => projects.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < projects.length);

const gridClass = computed(() => {
  if (projects.length === 1) {
    return gridClasses.single;
  }

  return projects.length === 2 ? gridClasses.pair : gridClasses.many;
});
const toggleLabel = computed(() => (hasMore.value ? "Show more" : "Show fewer"));
const headingFocusTarget = computed(() => heading.value ?? undefined);

function revealAt(index: number) {
  return stagger(index, STAGGER_CAP);
}

function openProject(index: number, trigger: HTMLElement) {
  returnFocusTo.value = trigger;
  openIndex.value = index;
}

function toggleVisible() {
  visibleCount.value = hasMore.value ? visibleCount.value + PAGE_SIZE : PAGE_SIZE;
}
</script>

<template>
  <section v-if="projects.length" id="work" aria-labelledby="work-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer>
      <div ref="heading" v-motion="reveal()" tabindex="-1" class="scroll-mt-nav">
        <BaseSectionHeading id="work-title" :title="copy.title" :eyebrow="copy.eyebrow" :lead="copy.lead" />
      </div>
      <ul :id="gridId" role="list" :class="['mt-12', gridClass]">
        <li v-for="(project, index) in visibleProjects" :key="project.slug" v-motion="revealAt(index)">
          <HomeProjectsCard :project="project" @open="openProject(index, $event)" />
        </li>
      </ul>
      <div v-if="projects.length > PAGE_SIZE" class="mt-8 text-center">
        <BaseButton variant="ghost" size="sm" :aria-controls="gridId" @click="toggleVisible">
          {{ toggleLabel }}
        </BaseButton>
      </div>
    </BaseContainer>
    <HomeProjectsLightbox v-model="openIndex" :projects="projects" :return-focus-to="returnFocusTo" :fallback-focus-to="headingFocusTarget" />
  </section>
</template>
