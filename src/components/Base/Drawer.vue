<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";

defineOptions({ name: "BaseDrawer" });

const { title } = defineProps<{ title: string }>();

const isOpen = defineModel<boolean>("open", { default: false });

const dialog = useTemplateRef("dialogEl");
let isBackdropPress = false;

watch(
  isOpen,
  (open) => {
    const element = dialog.value;

    if (element == null) {
      return;
    }

    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }
  },
  { flush: "post" }
);

function close() {
  dialog.value?.close();
}

function onClose() {
  isOpen.value = false;
}

function onPointerdown(event: PointerEvent) {
  isBackdropPress = event.target === dialog.value;
}

function onClick(event: MouseEvent) {
  if (isBackdropPress && event.target === dialog.value) {
    close();
  }
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="left-auto right-0 m-0 h-dvh max-h-none w-full max-w-md overscroll-contain bg-bg p-0 text-fg shadow-2xl backdrop:bg-fg/60 motion-safe:open:animate-drawer-in"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onClick"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 class="text-h3">{{ title }}</h2>
        <button type="button" class="grid size-11 shrink-0 place-items-center rounded border border-line hover:border-muted" @click="close">
          <PhX :size="20" />
        </button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>
