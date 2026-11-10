<script setup lang="ts">
import type { TProject } from "@/types";
import PhCamera from "~icons/ph/camera";
import PhChatText from "~icons/ph/chat-text";
import PhMapPin from "~icons/ph/map-pin";
import PhPaintRoller from "~icons/ph/paint-roller";

defineOptions({ name: "HomeProcess" });

const { project } = defineProps<{ project?: TProject }>();

const steps = [
  {
    icon: PhCamera,
    title: "Send a photo of your car",
    text: "Message it on Messenger, or attach it to the quote form. The quote is free.",
  },
  {
    icon: PhChatText,
    title: "Get a price from us",
    text: "We reply with a price for the work your car needs.",
  },
  {
    icon: PhMapPin,
    title: "Bring the car to Sagkahan",
    text: "We check the car and confirm the price before any work starts.",
  },
  {
    icon: PhPaintRoller,
    title: "Prep first, then paint or coat",
    text: "We sand and prime before paint, and correct the paint before a ceramic coat, so the finish lasts.",
  },
];
</script>

<template>
  <SectionBand id="process" title="How we quote and do the work" lead="Every job starts with a photo and ends with a price you agreed to." :project="project">
    <SectionBandCard v-for="step in steps" :key="step.title" :icon="step.icon" :title="step.title" :text="step.text" />
  </SectionBand>
</template>
