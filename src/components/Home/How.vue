<script setup lang="ts">
import { PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";

defineOptions({ name: "HomeHow" });
</script>

<template>
  <section id="how" aria-labelledby="how-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer>
      <BaseSectionHeading id="how-title" :title="home.how.title" :eyebrow="home.how.eyebrow" />
      <ol role="list" class="mt-12 grid gap-10 desk:grid-cols-3 desk:gap-8">
        <li v-for="(step, index) in home.how.steps" :key="step.title" v-motion="stagger(index)" class="border-t border-line pt-6">
          <span aria-hidden="true" class="text-h2 font-extrabold tabular-nums text-accent-text [font-stretch:125%]">{{ index + 1 }}</span>
          <h3 class="mt-4">{{ step.title }}</h3>
          <p class="mt-2 text-muted">{{ step.text }}</p>
        </li>
      </ol>
      <div class="mt-12 flex flex-wrap gap-3">
        <BaseButton :href="site.tel_href"><PhPhone aria-hidden="true" />Call</BaseButton>
        <BaseButton variant="ghost" :href="site.messenger_url"> <PhMessengerLogo aria-hidden="true" />Message </BaseButton>
        <BaseButton variant="ghost" href="#quote">Get a quote</BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>
