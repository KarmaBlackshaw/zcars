<script setup lang="ts">
import ojt from "@/assets/images/ojt.webp";

defineOptions({ name: "HomeTeam" });
</script>

<template>
  <section id="team" class="py-24 desk:py-32">
    <BaseContainer class="grid gap-12 desk:grid-cols-12 desk:items-center desk:gap-8">
      <figure v-motion="reveal()" class="desk:col-span-5">
        <div class="aspect-[4/5] overflow-hidden rounded-card bg-surface">
          <BaseParallaxImage
            :src="ojt"
            alt="EVSU automotive OJT students with a Zcars detailer inside the garage"
            width="960"
            height="1280"
            loading="lazy"
            class="size-full object-cover"
          />
        </div>
        <figcaption class="mt-3 text-sm text-muted">EVSU Automotive OJT at the Zcars garage.</figcaption>
      </figure>
      <div class="desk:col-span-6 desk:col-start-7">
        <div v-motion="reveal()">
          <BaseEyebrow>The crew</BaseEyebrow>
          <h2 class="mt-4 max-w-[16ch]">A garage that trains the next crew</h2>
          <p class="mt-5 max-w-[52ch] text-lead text-muted">Zcars hosts automotive OJT students from EVSU, learning the trade on real cars in our shop.</p>
        </div>
        <HomeTeamHiring />
      </div>
    </BaseContainer>
  </section>
</template>
