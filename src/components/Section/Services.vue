<script setup lang="ts">
import { sectionBodyClasses, sectionClasses } from "@/constants/section";
import type { TService } from "@/types";

defineOptions({ name: "SectionServices" });

const { title, lead, services } = defineProps<{ title: string; lead?: string; services: TService[] }>();
</script>

<template>
  <section v-if="services.length > 0" :class="sectionClasses">
    <BaseContainer>
      <BaseSectionHeading layout="split" :title="title" :lead="lead" />
      <div :class="sectionBodyClasses">
        <ServiceList :services="services" />
      </div>
    </BaseContainer>
  </section>
</template>
