<script setup lang="ts">
import { PhCaretLeft, PhCaretRight, PhX } from "@phosphor-icons/vue";

import type { TEntry, TProject } from "@/types";

defineOptions({ name: "HomeProjectsLightbox" });

const { projects, returnFocusTo, fallbackFocusTo } = defineProps<{
  projects: TEntry<TProject>[];
  returnFocusTo?: HTMLElement;
  fallbackFocusTo?: HTMLElement | null;
}>();

const index = defineModel<number>();

const dialogRef = useTemplateRef("dialogEl");
const titleId = useId();
const hasImageError = ref(false);
let isBackdropPress = false;

const photoIndex = ref(0);

const project = computed(() => (index.value != null ? projects[index.value] : undefined));
const photos = computed(() => project.value?.photos ?? []);
const photo = computed(() => photos.value[photoIndex.value]);
const hasMultiplePhotos = computed(() => photos.value.length > 1);
const positionText = computed(() => `${photoIndex.value + 1} of ${photos.value.length}`);
const statusText = computed(() => (hasMultiplePhotos.value ? `Photo ${positionText.value}` : ""));
const isFirst = computed(() => photoIndex.value === 0);
const isLast = computed(() => photoIndex.value === photos.value.length - 1);

watch(
  index,
  (current) => {
    const dialog = dialogRef.value;

    if (!dialog) {
      return;
    }

    if (current == null) {
      if (dialog.open) {
        dialog.close();
      }

      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }
  },
  { flush: "post" }
);

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
    new Image().src = neighbor.image;
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

  if (returnFocusTo?.isConnected) {
    returnFocusTo.focus();

    return;
  }

  fallbackFocusTo?.focus();
}

function close() {
  dialogRef.value?.close();
}

function onPointerdown(event: PointerEvent) {
  isBackdropPress = event.target === dialogRef.value;
}

function onBackdropClick(event: MouseEvent) {
  if (isBackdropPress && event.target === dialogRef.value) {
    close();
  }
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
    :aria-labelledby="titleId"
    class="m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain bg-bg p-0 text-fg backdrop:bg-inkBlack/80 desk:m-auto desk:h-auto desk:max-h-[90dvh] desk:w-auto desk:max-w-5xl desk:rounded-card"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onBackdropClick"
    @keydown="onKeydown"
  >
    <div role="status" aria-live="polite" class="sr-only">{{ statusText }}</div>
    <div v-if="project" class="flex h-full flex-col gap-4 p-4 desk:p-6">
      <button
        type="button"
        autofocus
        aria-label="Close"
        class="grid size-11 shrink-0 place-items-center self-end rounded-full border border-line hover:border-muted"
        @click="close"
      >
        <PhX :size="20" aria-hidden="true" />
      </button>
      <figure class="flex min-h-0 flex-1 flex-col gap-2 desk:flex-none">
        <div class="relative min-h-0 w-full flex-1 overflow-hidden rounded-xl bg-surface desk:flex-none">
          <p v-if="hasImageError" class="grid size-full place-items-center p-6 text-center text-muted desk:aspect-[4/3] desk:h-[60dvh] desk:w-auto">
            {{ photo?.alt }}
          </p>
          <img
            v-else-if="photo"
            :src="photo.image"
            alt=""
            class="size-full object-contain desk:mx-auto desk:h-auto desk:max-h-[70dvh] desk:w-auto"
            @error="onImageError"
          />
        </div>
        <figcaption v-if="photo && !hasImageError" class="text-small text-muted">{{ photo.alt }}</figcaption>
      </figure>
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 :id="titleId" class="text-h3">{{ project.title }}</h2>
          <p class="text-muted">{{ project.vehicle }}</p>
          <p v-if="hasMultiplePhotos" aria-hidden="true" class="text-small text-muted">{{ positionText }}</p>
        </div>
        <div v-if="hasMultiplePhotos" class="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous photo"
            :aria-disabled="isFirst"
            class="grid size-11 place-items-center rounded-full border border-line hover:border-muted aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            @click="go(-1)"
          >
            <PhCaretLeft :size="20" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            :aria-disabled="isLast"
            class="grid size-11 place-items-center rounded-full border border-line hover:border-muted aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            @click="go(1)"
          >
            <PhCaretRight :size="20" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>
