<script setup lang="ts">
import { SERVICES } from "@/types";

defineOptions({ name: "HomeServices" });
</script>

<template>
  <section id="services" class="py-24 desk:py-32">
    <BaseContainer>
      <div class="grid gap-6 desk:grid-cols-12 desk:items-end desk:gap-8">
        <div v-motion="reveal()" class="desk:col-span-7">
          <BaseEyebrow>Services</BaseEyebrow>
          <h2 class="mt-4">Everything your car needs</h2>
        </div>
        <p v-motion="reveal()" class="max-w-[44ch] text-lead text-muted desk:col-span-4 desk:col-start-9">
          From a dented bumper to a mirror finish. Bring it in once and drive out done.
        </p>
      </div>
      <ol role="list" class="mt-14 border-t border-line">
        <HomeServicesRow v-for="(service, index) in SERVICES" :key="service.id" v-motion="reveal(index * 0.09)" :service="service" :number="index + 1" />
      </ol>
    </BaseContainer>
  </section>
</template>
