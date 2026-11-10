<script setup lang="ts">
import { home, partners } from "virtual:content";
import { gridClasses, sectionClasses } from "@/constants/section";

defineOptions({ name: "HomeProcess" });

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

const listStyle = { "--n": steps.length };

const hasPartners = partners.length > 0;

function stepStyle(index: number) {
  return { "--i": index };
}
</script>

<template>
  <section id="process" :class="sectionClasses">
    <BaseContainer>
      <div :class="[gridClasses, 'desk:items-start']">
        <div class="contents desk:sticky desk:top-28 desk:col-span-5 desk:block desk:self-start">
          <BaseSectionHeading title="How we quote and do the work" lead="Every job starts with a photo and ends with a price you agreed to." />
          <div v-if="hasPartners" class="order-last">
            <h3 v-if="home.partners_title" class="mt-12">{{ home.partners_title }}</h3>
            <ul class="reveal mt-4 grid grid-cols-2 gap-3 desk:grid-cols-4">
              <li v-for="partner in partners" :key="partner.name" class="grid h-[72px] place-items-center rounded-xl bg-surface shadow-tile">
                <img :src="partner.logo" :alt="partner.name" loading="lazy" class="max-h-7 w-auto max-w-[70%] opacity-85 grayscale" />
              </li>
            </ul>
          </div>
        </div>
        <ol class="stack grid gap-6 desk:col-span-7 desk:gap-8" :style="listStyle">
          <BaseTile
            v-for="(step, index) in steps"
            :key="step.title"
            as="li"
            padding="lg"
            class="stack-card sticky top-[calc(5.5rem+var(--i)*.75rem)] min-h-[200px] desk:top-[calc(7rem+var(--i)*1rem)] desk:min-h-[260px]"
            :style="stepStyle(index)"
          >
            <p class="text-micro text-muted">Step {{ index + 1 }}</p>
            <h3 class="mt-4">{{ step.title }}</h3>
            <p class="mt-2 text-small text-muted">{{ step.text }}</p>
          </BaseTile>
        </ol>
      </div>
    </BaseContainer>
  </section>
</template>
