<script setup lang="ts">
import type { TProject } from "@/types";

defineOptions({ name: "SectionBand" });

const { title, lead, project } = defineProps<{ title: string; lead?: string; project?: TProject }>();

defineSlots<{ default?(): unknown }>();

const leftClass = computed(() => (project != null ? "desk:col-span-6" : "desk:col-span-12"));
const listClass = computed(() => (project != null ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 md:grid-cols-3"));
</script>

<template>
  <BasePanel>
    <div class="grid gap-10 py-16 desk:grid-cols-12 desk:items-center desk:gap-8 desk:py-20">
      <div :class="leftClass">
        <BaseSectionHeading :title="title" :lead="lead" size="lg" />
        <ul v-if="$slots.default" :class="['mt-8 desk:mt-10', listClass]">
          <slot></slot>
        </ul>
      </div>
      <SectionCompareCard v-if="project != null" :project="project" class="w-full desk:col-span-6 desk:max-w-[34rem] desk:justify-self-end" />
    </div>
  </BasePanel>
</template>
