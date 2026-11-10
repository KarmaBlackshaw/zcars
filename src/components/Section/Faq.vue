<script setup lang="ts">
import { gridClasses, sectionClasses } from "@/constants/section";
import type { TFaqItem } from "@/types";

defineOptions({ name: "SectionFaq" });

const { title, items } = defineProps<{ title: string; items: TFaqItem[] }>();
</script>

<template>
  <section v-if="items.length > 0" id="faq" :class="sectionClasses">
    <BaseContainer>
      <div :class="gridClasses">
        <div class="desk:col-span-4">
          <div class="desk:sticky desk:top-28">
            <BaseSectionHeading :title="title" />
          </div>
        </div>
        <div class="desk:col-span-7 desk:col-start-6">
          <BaseFaqList :items="items" />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
