<script setup lang="ts">
import { sectionBodyClasses, sectionClasses } from "@/constants/section";
import type { TProject } from "@/types";

defineOptions({ name: "SectionWork" });

const { title, projects } = defineProps<{ title: string; projects: TProject[] }>();

const slots = defineSlots<{ action?(): unknown; feature?(): unknown }>();

const openIndex = ref<number>();

const gridClass = computed(() =>
  slots.feature == null && projects.length <= 2 ? "md:grid-cols-2 desk:max-w-[56rem]" : "md:grid-flow-dense md:grid-cols-3 desk:grid-cols-4"
);

function cellOrder(index: number) {
  if (index < 2) {
    return "";
  }

  return index === 2 ? "order-2 desk:order-none" : "order-2";
}
</script>

<template>
  <section v-if="projects.length > 0 || $slots.feature" id="work" class="kit-mesh" :class="sectionClasses" data-qa="work">
    <BaseContainer>
      <BaseSectionHeading :title="title" layout="split">
        <template v-if="$slots.action" #action><slot name="action"></slot></template>
      </BaseSectionHeading>
      <div :class="sectionBodyClasses">
        <ul :class="gridClass" class="grid grid-cols-2 gap-3 desk:gap-5">
          <li v-if="$slots.feature" class="order-1 col-span-2 desk:col-span-1"><slot name="feature"></slot></li>
          <li v-for="(project, index) in projects" :key="project.slug" :class="cellOrder(index)">
            <SectionWorkTile :project="project" @open="openIndex = index" />
          </li>
        </ul>
      </div>
      <SectionWorkLightbox v-model="openIndex" :projects="projects" />
    </BaseContainer>
  </section>
</template>
