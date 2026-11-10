<script setup lang="ts">
import PhX from "~icons/ph/x";

defineOptions({ name: "BaseDrawer" });

const { title } = defineProps<{ title: string }>();

const isOpen = defineModel<boolean>("open", { default: false });

const dialog = useTemplateRef("dialogEl");
const { close, onPointerdown, onClick } = useModalDialog(isOpen, dialog);

function onClose() {
  isOpen.value = false;
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="left-auto right-0 m-0 h-dvh max-h-none w-full max-w-md overscroll-contain bg-bg p-0 text-fg shadow-2xl backdrop:bg-night/60 motion-safe:open:animate-drawer-in"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onClick"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 class="text-tile-title">{{ title }}</h2>
        <BaseButton variant="dark" size="icon" class="shrink-0" @click="close">
          <PhX class="size-5" />
        </BaseButton>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>
