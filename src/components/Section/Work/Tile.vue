<script setup lang="ts">
import { PhImages } from "@phosphor-icons/vue";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkTile" });

const { project } = defineProps<{ project: TProject }>();

defineEmits<{ open: [] }>();

const hasMultiplePhotos = computed(() => project.gallery.length > 1);
</script>

<template>
  <button
    type="button"
    class="group flex size-full flex-col overflow-clip rounded-lg border border-bluishWhite bg-white text-left transition-[transform,box-shadow] duration-200 ease-settle hover:shadow-lift motion-safe:hover:-translate-y-0.5"
    :data-qa="`work-tile-${project.slug}`"
    @click="$emit('open')"
  >
    <div class="relative aspect-[4/5] w-full overflow-clip">
      <BaseImage
        :src="project.photos[0]"
        :alt="project.title"
        sizes="(min-width: 900px) 25vw, (min-width: 768px) 33vw, 50vw"
        loading="lazy"
        class="absolute inset-0 size-full object-cover contrast-[1.04] saturate-[1.06] transition-transform duration-[600ms] ease-settle motion-safe:group-hover:scale-[1.03]"
      />
      <BasePatch v-if="hasMultiplePhotos" class="absolute right-3 top-3">
        <PhImages :size="13" weight="bold" />
        {{ project.gallery.length }}
      </BasePatch>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-4 desk:p-5">
      <h3>{{ project.vehicle }}</h3>
      <SectionWorkTags :project="project" />
    </div>
  </button>
</template>
