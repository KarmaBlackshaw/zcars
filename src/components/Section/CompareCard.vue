<script setup lang="ts">
import type { TProject } from "@/types";

defineOptions({ name: "SectionCompareCard" });

const { project } = defineProps<{ project: TProject }>();

const FOCUS = "50% 60%";
</script>

<template>
  <div class="relative aspect-[4/5] w-full overflow-clip rounded-lg bg-americanDiamond" data-qa="compare-card">
    <BaseCompareSlider
      v-if="project.before_photo != null"
      :before="project.before_photo"
      :after="project.photos[0]"
      :alt="project.title"
      sizes="(min-width: 900px) 34rem, 100vw"
      :focus="FOCUS"
      class="size-full"
    />
  </div>
</template>
