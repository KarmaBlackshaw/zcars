<script setup lang="ts">
import { PhShieldCheck } from "@phosphor-icons/vue";
import { home } from "virtual:content";

defineOptions({ name: "HomeTrust" });

const { stats, warranty } = home.trust;
const warrantyIndex = stats.length;
const isVisible = stats.length > 0 || warranty != null;
</script>

<template>
  <section v-if="isVisible" class="border-y border-line bg-surface">
    <BaseContainer>
      <ul role="list" aria-label="Why Zcars" class="grid grid-cols-2 gap-x-6 gap-y-8 py-8 desk:flex desk:items-center desk:justify-between desk:gap-10">
        <li v-for="(stat, index) in stats" :key="`${stat.value}-${stat.label}`" v-motion="stagger(index)">
          <strong class="block text-h3 font-bold tracking-heading">{{ stat.value }}</strong>
          <span class="block text-small text-muted">{{ stat.label }}</span>
        </li>
        <li v-if="warranty" v-motion="stagger(warrantyIndex)" class="col-span-2 flex items-start gap-3 desk:col-span-1 desk:max-w-sm">
          <PhShieldCheck aria-hidden="true" :size="28" class="shrink-0 text-accent-text" />
          <div>
            <strong class="block font-bold">{{ warranty.title }}</strong>
            <span class="block text-small text-muted">{{ warranty.text }}</span>
          </div>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
