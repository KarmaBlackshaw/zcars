<script setup lang="ts">
import { animate } from "motion-v";

import { services } from "virtual:content";

import { settle } from "@/constants/motion";
import type { TProject } from "@/types";

defineOptions({ name: "SectionCompareCard" });

const { project } = defineProps<{ project: TProject }>();

const FOCUS = "50% 60%";

const position = ref(50);
const before = computed(() => project.before_photo);
const servicesText = computed(() => formatProjectServices(project, services));

const reducedMotion = usePreferredReducedMotion();
const card = useTemplateRef("cardEl");
const isVisible = useElementVisibility(card, { threshold: 0.5, once: true });

let sweep: ReturnType<typeof animate> | undefined;
let isSweeping = false;

function startSweep() {
  if (before.value == null || reducedMotion.value === "reduce") {
    return;
  }

  isSweeping = true;

  sweep = animate(50, [50, 82, 18, 50], {
    duration: 1.8,
    delay: 0.4,
    ease: settle.ease,
    onUpdate: (value) => {
      if (isSweeping) {
        position.value = value;
      }
    },
  });
}

watch(isVisible, (isShown) => {
  if (isShown) {
    startSweep();
  }
});

function stopSweep() {
  // motion's stop() fires one last onUpdate with the sweep's current value
  isSweeping = false;
  sweep?.stop();
}

onBeforeUnmount(stopSweep);
</script>

<template>
  <div ref="cardEl" class="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lift">
    <BaseCompareSlider
      v-if="before != null"
      v-model:position="position"
      :before="before"
      :after="project.photos[0]"
      :alt="project.title"
      :focus="FOCUS"
      class="size-full"
      @pointerdown.once="stopSweep"
    />
    <BaseImageCaption>
      <p class="font-display text-eyebrow uppercase italic text-hot">Before and after</p>
      <p class="mt-1 font-display text-tile-title uppercase italic">{{ project.vehicle }}</p>
      <p v-if="servicesText" class="mt-1 text-small">{{ servicesText }}</p>
    </BaseImageCaption>
  </div>
</template>
