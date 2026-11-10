<script setup lang="ts">
import { animate } from "motion-v";

import { settle } from "@/constants/motion";
import type { TProject } from "@/types";

defineOptions({ name: "SectionHeroPicture" });

const { src, alt, project } = defineProps<{ src: string; alt: string; project?: TProject }>();

const ENTRANCE_MS = 1000;
const FOCUS = "50% 60%";

const position = ref(50);
const before = computed(() => project?.before_photo);

let sweep: ReturnType<typeof animate> | undefined;
let isSweeping = false;

onMounted(() => {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (before.value == null || isReduced) {
    return;
  }

  const [firstPaint] = performance.getEntriesByName("first-contentful-paint");
  const paintedAt = firstPaint?.startTime ?? performance.now();
  const delay = Math.max(0, paintedAt + ENTRANCE_MS - performance.now()) / 1000;

  isSweeping = true;

  sweep = animate(50, [50, 82, 18, 50], {
    duration: 1.8,
    delay,
    ease: settle.ease,
    onUpdate: (value) => {
      if (isSweeping) {
        position.value = value;
      }
    },
  });
});

function stopSweep() {
  // motion's stop() fires one last onUpdate with the sweep's current value
  isSweeping = false;
  sweep?.stop();
}

onBeforeUnmount(stopSweep);
</script>

<template>
  <div>
    <BaseCompareSlider
      v-if="before != null"
      v-model:position="position"
      :before="before"
      :after="src"
      :alt="alt"
      :focus="FOCUS"
      class="aspect-[4/3] desk:aspect-[4/5] desk:max-h-[calc(100svh-theme(spacing.nav)-7rem)]"
      @pointerdown.once="stopSweep"
    />
    <img
      v-else
      :src="src"
      :alt="alt"
      fetchpriority="high"
      class="aspect-[4/3] w-full rounded-none bg-surface object-cover object-[50%_60%] desk:aspect-[4/5] desk:max-h-[calc(100svh-theme(spacing.nav)-7rem)]"
    />
    <ProjectBadgeRow v-if="project" :project="project" class="mt-3" />
  </div>
</template>
