<script setup lang="ts">
import { sectionBodyClasses, sectionClasses } from "@/constants/section";
import type { TProject } from "@/types";

defineOptions({ name: "SectionWork" });

const { title, projects } = defineProps<{ title: string; projects: TProject[] }>();

defineSlots<{ action?(): unknown; feature?(): unknown }>();

const openIndex = ref<number>();

function cellOrder(index: number) {
  if (index < 2) {
    return "";
  }

  return index === 2 ? "order-2 desk:order-none" : "order-2";
}
</script>

<template>
  <section v-if="projects.length > 0 || $slots.feature" id="work" :class="sectionClasses">
    <BaseContainer>
      <BaseSectionHeading :title="title" layout="split">
        <template v-if="$slots.action" #action><slot name="action"></slot></template>
      </BaseSectionHeading>
      <div :class="sectionBodyClasses">
        <ul class="grid grid-cols-2 gap-3 md:grid-cols-3 desk:grid-cols-4 desk:gap-5">
          <li v-if="$slots.feature" class="order-1 col-span-2 md:col-span-1"><slot name="feature"></slot></li>
          <li v-for="(project, index) in projects" :key="project.slug" :class="['reveal', cellOrder(index)]">
            <SectionWorkTile :project="project" @open="openIndex = index" />
          </li>
        </ul>
      </div>
      <SectionWorkLightbox v-model="openIndex" :projects="projects" />
    </BaseContainer>
  </section>
</template>
