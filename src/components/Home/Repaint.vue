<script setup lang="ts">
import repaint from "@/assets/images/repaint.webp";

defineOptions({ name: "HomeRepaint" });

const steps = [
  { title: "Sand", text: "Proper sanding, never rushed" },
  { title: "Prime", text: "Primer laid before any color" },
  { title: "Paint", text: "Professional-grade refinish" },
];
</script>

<template>
  <section aria-labelledby="repaint-title" class="pb-8">
    <BaseContainer>
      <div v-motion="reveal()" class="grid overflow-hidden rounded-card bg-bunker text-sportyWhite desk:grid-cols-12">
        <figure class="relative aspect-[4/3] overflow-hidden desk:col-span-6 desk:aspect-auto desk:min-h-[560px]">
          <BaseParallaxImage
            :src="repaint"
            alt="White Subaru mid-repaint with primer on the front fender"
            width="540"
            height="634"
            loading="lazy"
            class="absolute inset-0 size-full object-cover"
          />
        </figure>
        <div class="flex flex-col justify-center gap-10 p-7 desk:col-span-6 desk:p-14">
          <div>
            <BaseEyebrow class="text-ghost">Repaint</BaseEyebrow>
            <h2 id="repaint-title" class="mt-4 max-w-[14ch]">Prepped right, painted once.</h2>
            <p class="mt-5 max-w-[44ch] text-lead text-ghost">
              Every repaint starts with proper sanding and primer, the step most shops rush. That is why the finish lasts.
            </p>
          </div>
          <ol role="list" class="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            <li v-for="(step, index) in steps" :key="step.title" class="bg-bunker p-5">
              <span class="text-micro font-semibold tabular-nums text-ghost">0{{ index + 1 }}</span>
              <strong class="mt-6 block text-lead font-semibold">{{ step.title }}</strong>
              <span class="mt-1 block text-small text-ghost">{{ step.text }}</span>
            </li>
          </ol>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
