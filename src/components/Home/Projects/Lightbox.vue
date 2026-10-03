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

const project = computed(() => (index.value != null ? projects[index.value] : undefined));
const positionText = computed(() => (index.value != null ? `${index.value + 1} of ${projects.length}` : ""));
const isFirst = computed(() => index.value === 0);
const isLast = computed(() => index.value === projects.length - 1);

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

    hasImageError.value = false;

    if (!dialog.open) {
      dialog.showModal();
    }

    preload(current - 1);
    preload(current + 1);
  },
  { flush: "post" }
);

function preload(at: number) {
  const neighbor = projects[at];

  if (neighbor) {
    new Image().src = neighbor.after;
  }
}

function go(step: number) {
  if (index.value == null) {
    return;
  }

  const next = index.value + step;

  if (next >= 0 && next < projects.length) {
    index.value = next;
  }
}

function onClose() {
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
  const isRange = event.target instanceof HTMLInputElement && event.target.type === "range";

  if (isRange) {
    return;
  }

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
    class="m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain bg-bg p-0 text-fg backdrop:bg-inkBlack/80 desk:m-auto desk:h-auto desk:max-h-[90dvh] desk:max-w-5xl desk:rounded-card"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onBackdropClick"
    @keydown="onKeydown"
  >
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
      <div class="relative min-h-0 w-full flex-1 overflow-hidden rounded-xl bg-surface desk:aspect-[4/3] desk:max-h-[70dvh] desk:flex-none">
        <HomeProjectsCompare
          v-if="project.before"
          :before="project.before.image"
          :before-alt="project.before.alt"
          :after="project.after"
          :after-alt="project.after_alt"
        />
        <p v-else-if="hasImageError" class="grid size-full place-items-center p-6 text-center text-muted">{{ project.after_alt }}</p>
        <img v-else :src="project.after" :alt="project.after_alt" class="size-full object-contain" @error="onImageError" />
      </div>
      <div class="flex items-center justify-between gap-4">
        <div aria-live="polite">
          <h2 :id="titleId" class="text-h3">{{ project.title }}</h2>
          <p class="text-muted">{{ project.vehicle }}</p>
          <span class="sr-only">{{ positionText }}</span>
        </div>
        <div class="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous project"
            :aria-disabled="isFirst"
            class="grid size-11 place-items-center rounded-full border border-line hover:border-muted aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            @click="go(-1)"
          >
            <PhCaretLeft :size="20" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next project"
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
