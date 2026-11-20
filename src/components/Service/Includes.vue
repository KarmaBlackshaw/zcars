<script setup lang="ts">
import { PhCheck } from "@phosphor-icons/vue";

import { sectionClasses } from "@/constants/section";
import type { TProject } from "@/types";

defineOptions({ name: "ServiceIncludes" });

const { title, items, project } = defineProps<{ title: string; items: string[]; project?: TProject }>();

const hasCompare = computed(() => project != null);
const gridClass = computed(() => (hasCompare.value ? "desk:items-center" : "desk:items-start"));
const copyClass = computed(() => (hasCompare.value ? "desk:col-span-6" : "desk:contents"));
const headingClass = computed(() => (hasCompare.value ? "" : "desk:col-span-5"));
const listClass = computed(() => (hasCompare.value ? "desk:mt-12" : "desk:col-span-7 desk:mt-0"));
</script>

<template>
  <section class="kit-away" :class="sectionClasses" data-qa="service-includes">
    <BaseContainer>
      <div :class="gridClass" class="grid gap-12 desk:grid-cols-12 desk:gap-8">
        <div :class="copyClass">
          <h2 :class="headingClass">{{ title }}</h2>
          <ul v-if="items.length > 0" :class="listClass" class="mt-10 border-t border-line">
            <li
              v-for="(item, index) in items"
              :key="item"
              class="flex items-start gap-4 border-b border-line py-4 text-lead"
              :data-qa="`service-include-${index}`"
            >
              <span class="mt-0.5 grid size-7 shrink-0 place-items-center rounded bg-blueGrotto text-white">
                <PhCheck :size="16" weight="bold" />
              </span>
              {{ item }}
            </li>
          </ul>
        </div>
        <SectionCompareCard v-if="project != null" :project="project" class="max-desk:max-w-photo desk:col-span-5 desk:col-start-8" />
      </div>
    </BaseContainer>
  </section>
</template>
