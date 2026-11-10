<script setup lang="ts">
import { PhCaretLeft, PhCaretRight, PhX } from "@phosphor-icons/vue";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkLightbox" });

const { projects } = defineProps<{ projects: TProject[] }>();

const index = defineModel<number>();

const dialogRef = useTemplateRef("dialogEl");
const hasImageError = ref(false);

const photoIndex = ref(0);

const { close, onPointerdown, onClick } = useModalDialog(() => index.value != null, dialogRef);

const project = computed(() => (index.value != null ? projects[index.value] : undefined));
const photos = computed(() => project.value?.gallery ?? []);
const photo = computed(() => photos.value[photoIndex.value]);
const hasMultiplePhotos = computed(() => photos.value.length > 1);
const positionText = computed(() => `${photoIndex.value + 1} of ${photos.value.length}`);
const photoAlt = computed(() => (hasMultiplePhotos.value ? `${project.value?.title}, photo ${positionText.value}` : project.value?.title));
const isFirst = computed(() => photoIndex.value === 0);
const isLast = computed(() => photoIndex.value === photos.value.length - 1);

watch(
  photo,
  () => {
    hasImageError.value = false;
    preload(photoIndex.value - 1);
    preload(photoIndex.value + 1);
  },
  { flush: "post" }
);

function preload(at: number) {
  const neighbor = photos.value[at];

  if (neighbor) {
    new Image().src = neighbor;
  }
}

function go(step: number) {
  const next = photoIndex.value + step;

  if (next >= 0 && next < photos.value.length) {
    photoIndex.value = next;
  }
}

function onClose() {
  photoIndex.value = 0;
  index.value = undefined;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    go(-1);
  } else if (event.key === "ArrowRight") {
    go(1);
  }
}

function onImageError() {
  hasImageError.value = true;
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="night m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain bg-bg p-0 text-fg shadow-2xl backdrop:bg-night/80 desk:m-auto desk:h-auto desk:max-h-[90dvh] desk:w-auto desk:max-w-5xl desk:rounded-2xl"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onClick"
    @keydown="onKeydown"
  >
    <div v-if="project" class="flex h-full flex-col gap-4 p-4 desk:p-6">
      <BaseButton variant="light" size="icon" class="shrink-0 self-end" @click="close">
        <PhX :size="20" />
      </BaseButton>
      <figure class="flex min-h-0 flex-1 flex-col gap-2 desk:flex-none">
        <div class="relative min-h-0 w-full flex-1 overflow-hidden rounded-xl bg-surface desk:flex-none">
          <p v-if="hasImageError" class="grid size-full place-items-center p-6 text-center text-muted desk:aspect-[4/3] desk:h-[60dvh] desk:w-auto">
            {{ photoAlt }}
          </p>
          <img
            v-else-if="photo"
            :src="photo"
            :alt="photoAlt"
            class="size-full object-contain desk:mx-auto desk:h-auto desk:max-h-[70dvh] desk:w-auto"
            @error="onImageError"
          />
        </div>
      </figure>
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-card-title">{{ project.title }}</h2>
          <p class="text-muted">{{ project.vehicle }}</p>
          <p v-if="hasMultiplePhotos" class="text-small text-muted">{{ positionText }}</p>
        </div>
        <div v-if="hasMultiplePhotos" class="flex shrink-0 gap-2">
          <BaseButton variant="light" size="icon" :disabled="isFirst" @click="go(-1)">
            <PhCaretLeft :size="20" />
          </BaseButton>
          <BaseButton variant="light" size="icon" :disabled="isLast" @click="go(1)">
            <PhCaretRight :size="20" />
          </BaseButton>
        </div>
      </div>
    </div>
  </dialog>
</template>
