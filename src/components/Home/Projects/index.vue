<script setup lang="ts">
import { home, projects } from "virtual:content";

defineOptions({ name: "HomeProjects" });

const VISIBLE_LIMIT = 6;
const STAGGER_CAP = 4;

const gridClasses = {
  single: "grid max-w-xl",
  pair: "grid grid-cols-2 gap-4",
  many: "grid grid-cols-2 gap-4 sm:grid-cols-3",
};

const copy = home.projects;
const gridId = useId();
const heading = useTemplateRef("heading");
const isExpanded = ref(false);
const openIndex = ref<number>();
const returnFocusTo = shallowRef<HTMLElement>();

const visibleProjects = computed(() => (isExpanded.value ? projects : projects.slice(0, VISIBLE_LIMIT)));

const gridClass = computed(() => {
  if (projects.length === 1) {
    return gridClasses.single;
  }

  return projects.length === 2 ? gridClasses.pair : gridClasses.many;
});
const toggleLabel = computed(() => (isExpanded.value ? "Show fewer" : `Show all (${projects.length})`));
const headingFocusTarget = computed(() => heading.value ?? undefined);

function revealAt(index: number) {
  return stagger(index, STAGGER_CAP);
}

function openProject(index: number, trigger: HTMLElement) {
  returnFocusTo.value = trigger;
  openIndex.value = index;
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
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
      <BaseButton
        v-if="projects.length > VISIBLE_LIMIT"
        variant="ghost"
        size="sm"
        :aria-expanded="isExpanded"
        :aria-controls="gridId"
        class="mt-8"
        @click="toggleExpanded"
      >
        {{ toggleLabel }}
      </BaseButton>
    </BaseContainer>
    <HomeProjectsLightbox v-model="openIndex" :projects="projects" :return-focus-to="returnFocusTo" :fallback-focus-to="headingFocusTarget" />
  </section>
</template>
