<script setup lang="ts">
import { gridClasses, sectionClasses } from "@/constants/section";
import type { TFaqItem } from "@/types";

defineOptions({ name: "SectionFaq" });

const { title, items } = defineProps<{ title: string; items: TFaqItem[] }>();
</script>

<template>
  <section v-if="items.length > 0" id="faq" class="kit-away" :class="sectionClasses" data-qa="faq">
    <BaseContainer>
      <div :class="[gridClasses, 'gap-y-10']">
        <div class="desk:col-span-4">
          <h2 class="desk:sticky desk:top-28">{{ title }}</h2>
        </div>
        <div class="desk:col-span-8">
          <BaseFaqList :items="items" />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
