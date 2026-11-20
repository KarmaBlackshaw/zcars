<script setup lang="ts">
import type { TProject } from "@/types";

defineOptions({ name: "HomeProcess" });

const { project } = defineProps<{ project?: TProject }>();

const steps = [
  {
    title: "Send a photo of your car",
    text: "Message it on Messenger, or attach it to the quote form. The quote is free.",
  },
  {
    title: "Get a price from us",
    text: "We reply with a price for the work your car needs.",
  },
  {
    title: "Bring the car to Sagkahan",
    text: "We check the car and confirm the price before any work starts.",
  },
  {
    title: "Prep first, then paint or coat",
    text: "We sand and prime before paint, and correct the paint before a ceramic coat, so the finish lasts.",
  },
];
</script>

<template>
  <section id="process" class="kit-home scroll-mt-nav" data-qa="process">
    <div class="rib"></div>
    <BaseContainer>
      <div class="grid gap-12 py-16 desk:grid-cols-12 desk:items-center desk:gap-8 desk:py-28">
        <div class="desk:col-span-6">
          <BaseSectionHeading title="How a Zcars quote works" lead="Every job starts with a photo and ends with a price you agreed to." />
          <ol class="mt-10 border-t border-line desk:mt-12">
            <li
              v-for="(step, index) in steps"
              :key="step.title"
              class="grid gap-2 border-b border-line py-5 desk:grid-cols-[7rem_1fr] desk:gap-6"
              :data-qa="`process-step-${index + 1}`"
            >
              <p class="name-line pt-1.5">Step {{ index + 1 }}</p>
              <div>
                <h3>{{ step.title }}</h3>
                <p class="mt-1.5 max-w-[48ch]">{{ step.text }}</p>
              </div>
            </li>
          </ol>
        </div>
        <SectionCompareCard v-if="project != null" :project="project" class="max-desk:max-w-photo desk:col-span-5 desk:col-start-8" />
      </div>
    </BaseContainer>
    <div class="rib"></div>
  </section>
</template>
