<script setup lang="ts">
import { animate } from "motion-v";

import { services } from "virtual:content";

import { settle } from "@/constants/motion";
import type { TProject } from "@/types";

defineOptions({ name: "SectionHeroPicture" });

const { src, alt, project } = defineProps<{ src: string; alt: string; project?: TProject }>();

const ENTRANCE_MS = 1000;
const FOCUS = "50% 60%";

const position = ref(50);
const before = computed(() => project?.before_photo);

const chipText = computed(() => (project == null ? "" : [project.vehicle, formatProjectServices(project, services)].filter(Boolean).join(" · ")));

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
  <BaseTile padding="none" class="aspect-[4/5] max-w-photo desk:aspect-auto desk:max-w-none">
    <div class="relative size-full">
      <BaseCompareSlider
        v-if="before != null"
        v-model:position="position"
        :before="before"
        :after="src"
        :alt="alt"
        :focus="FOCUS"
        class="size-full"
        @pointerdown.once="stopSweep"
      />
      <img v-else :src="src" :alt="alt" fetchpriority="high" class="size-full object-cover object-[50%_60%]" />
      <BaseChip v-if="chipText" size="sm" class="absolute bottom-3 left-3">{{ chipText }}</BaseChip>
    </div>
  </BaseTile>
</template>
