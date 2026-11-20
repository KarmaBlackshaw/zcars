<script setup lang="ts">
import { PhCaretLeft, PhCaretRight, PhX } from "@phosphor-icons/vue";
import { images } from "virtual:content";

import type { TProject } from "@/types";

defineOptions({ name: "SectionWorkLightbox" });

const { projects } = defineProps<{ projects: TProject[] }>();

const index = defineModel<number>();

const PHOTO_SIZES = "(min-width: 900px) 64rem, 100vw";

const dialogRef = useTemplateRef("dialogEl");
const hasImageError = ref(false);

const photoIndex = ref(0);

const { close, onPointerdown, onClick } = useModalDialog(() => index.value != null, dialogRef);

const project = computed(() => (index.value != null ? projects[index.value] : undefined));
const photos = computed(() => project.value?.gallery ?? []);
const photo = computed(() => photos.value[photoIndex.value]);
const hasMultiplePhotos = computed(() => photos.value.length > 1);
const positionText = computed(() => `${photoIndex.value + 1} of ${photos.value.length}`);
const counterText = computed(() => `Photo ${positionText.value}`);
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
  const image = neighbor == null ? undefined : images[neighbor];

  if (image != null) {
    Object.assign(new Image(), { sizes: PHOTO_SIZES, srcset: image.srcset });
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
    class="kit-away m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain p-0 shadow-float backdrop:bg-coveGray/90 desk:m-auto desk:h-auto desk:max-h-[92dvh] desk:w-auto desk:max-w-5xl desk:rounded-lg"
    data-qa="lightbox"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onClick"
    @keydown="onKeydown"
  >
    <div v-if="project" class="flex h-full flex-col">
      <div class="rib shrink-0"></div>
      <div class="flex min-h-0 flex-1 flex-col gap-4 p-4 desk:p-6">
        <BaseButton variant="ghost" size="icon" class="absolute right-4 top-6 z-10 desk:right-6 desk:top-8" data-qa="lightbox-close" @click="close">
          <PhX :size="20" />
        </BaseButton>
        <figure class="flex min-h-0 flex-1 flex-col desk:flex-none">
          <div class="relative min-h-0 w-full flex-1 overflow-clip rounded-lg bg-americanDiamond desk:flex-none">
            <p v-if="hasImageError" class="grid size-full place-items-center p-6 text-center text-muted desk:aspect-[4/3] desk:h-[60dvh] desk:w-auto">
              {{ photoAlt }}
            </p>
            <BaseImage
              v-else-if="photo"
              :src="photo"
              :alt="photoAlt"
              :sizes="PHOTO_SIZES"
              class="size-full object-contain desk:mx-auto desk:h-auto desk:max-h-[72dvh] desk:w-auto"
              data-qa="lightbox-photo"
              @error="onImageError"
            />
          </div>
        </figure>
        <div class="flex items-end justify-between gap-4">
          <div class="grid gap-2">
            <h2 class="text-h3" data-qa="lightbox-vehicle">{{ project.vehicle }}</h2>
            <SectionWorkTags :project="project" />
            <p v-if="hasMultiplePhotos" class="name-line text-muted" data-qa="lightbox-counter">{{ counterText }}</p>
          </div>
          <div v-if="hasMultiplePhotos" class="flex shrink-0 gap-2">
            <BaseButton variant="ghost" size="icon" :disabled="isFirst" data-qa="lightbox-prev" @click="go(-1)">
              <PhCaretLeft :size="20" />
            </BaseButton>
            <BaseButton variant="ghost" size="icon" :disabled="isLast" data-qa="lightbox-next" @click="go(1)">
              <PhCaretRight :size="20" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
