<script setup lang="ts">
import { home, partners } from "virtual:content";
import { badgeClasses } from "@/constants/brand";
import { ruledSectionClasses } from "@/constants/section";

defineOptions({ name: "HomeProcess" });

const steps = [
  {
    label: "PHOTO",
    title: "Send a photo of your car",
    text: "Message it on Messenger, or attach it to the quote form. The quote is free.",
  },
  {
    label: "PRICE",
    title: "Get a price from us",
    text: "We reply with a price for the work your car needs.",
  },
  {
    label: "CHECK",
    title: "Bring the car to Sagkahan",
    text: "We check the car and confirm the price before any work starts.",
  },
  {
    label: "FINISH",
    title: "Prep first, then paint or coat",
    text: "We sand and prime before paint, and correct the paint before a ceramic coat, so the finish lasts.",
  },
];

const listFormat = new Intl.ListFormat("en-GB", { type: "conjunction" });

const productsLine = home.partners_title && partners.length > 0 ? `${home.partners_title}: ${listFormat.format(partners.map(({ name }) => name))}.` : undefined;
</script>

<template>
  <section id="process" :class="ruledSectionClasses">
    <BaseContainer>
      <div v-motion="revealFade()" class="grid gap-6 desk:grid-cols-12 desk:items-end desk:gap-8">
        <h2 class="desk:col-span-6">How we quote and do the work</h2>
        <p class="text-lead text-muted desk:col-span-5 desk:col-start-8">Every job starts with a photo and ends with a price you agreed to.</p>
      </div>
      <ol class="mt-12 grid gap-8 desk:mt-14 desk:grid-cols-4 desk:gap-6">
        <li v-for="(step, index) in steps" :key="step.label" v-motion="stagger(index)" class="border-t border-fg pt-5">
          <p :class="badgeClasses">{{ step.label }}</p>
          <h3 class="mt-4">{{ step.title }}</h3>
          <p class="mt-2 text-muted">{{ step.text }}</p>
        </li>
      </ol>
      <p v-if="productsLine" v-motion="revealFade()" class="mt-12 max-w-[68ch] text-muted">{{ productsLine }}</p>
    </BaseContainer>
  </section>
</template>
