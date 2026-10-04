<script setup lang="ts">
import { home } from "virtual:content";

defineOptions({ name: "HomeRepaint" });
</script>

<template>
  <section aria-labelledby="repaint-title" class="pb-8">
    <BaseContainer>
      <div v-motion="reveal()" class="grid overflow-hidden rounded-card bg-bunker text-sportyWhite desk:grid-cols-12">
        <figure class="relative aspect-[4/3] overflow-hidden desk:col-span-6 desk:aspect-auto desk:min-h-[560px]">
          <BaseParallaxImage :src="home.repaint.image" :alt="home.repaint.title" loading="lazy" class="absolute inset-0 size-full object-cover" />
        </figure>
        <div class="flex flex-col justify-center gap-10 p-7 desk:col-span-6 desk:p-14">
          <BaseSectionHeading
            id="repaint-title"
            :title="home.repaint.title"
            :eyebrow="home.repaint.eyebrow"
            :lead="home.repaint.lead"
            class="[&>h2]:max-w-[14ch] [&>p]:max-w-[44ch] [&>p]:text-ghost [&>span]:text-ghost"
          />
          <ol role="list" class="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            <li v-for="(step, index) in home.repaint.steps" :key="step.title" class="bg-bunker p-5">
              <span class="text-micro font-semibold tabular-nums text-ghost">0{{ index + 1 }}</span>
              <strong class="mt-6 block text-lead font-semibold">{{ step.title }}</strong>
              <span class="mt-1 block text-small text-ghost">{{ step.text }}</span>
            </li>
          </ol>
          <BaseButton href="#quote" class="self-start focus-visible:outline-sportyWhite">Get a quote</BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
