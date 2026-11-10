<script setup lang="ts">
import { ruledSectionClasses } from "@/constants/section";
import type { TFaqItem } from "@/types";

defineOptions({ name: "SectionFaq" });

const { title, items } = defineProps<{ title: string; items: TFaqItem[] }>();
</script>

<template>
  <section v-if="items.length > 0" id="faq" :class="ruledSectionClasses">
    <BaseContainer class="grid gap-8 desk:grid-cols-12 desk:gap-x-8">
      <div v-motion="revealFade()" class="desk:col-span-4">
        <BaseSectionHeading :title="title" />
      </div>
      <div v-motion="revealFade(0.08)" class="desk:col-span-8">
        <BaseFaqList :items="items" />
      </div>
    </BaseContainer>
  </section>
</template>
