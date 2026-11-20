<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";

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
    class="kit-away left-auto right-0 m-0 h-dvh max-h-none w-full max-w-[30rem] overscroll-contain p-0 shadow-float backdrop:bg-coveGray/70 motion-safe:open:animate-drawer-in"
    @close="onClose"
    @pointerdown="onPointerdown"
    @click="onClick"
  >
    <div class="flex h-full flex-col">
      <div class="kit-home shrink-0">
        <div class="flex items-center justify-between gap-4 px-5 py-4">
          <h2 class="text-h3" data-qa="drawer-title">{{ title }}</h2>
          <BaseButton variant="ghost" size="icon" class="shrink-0" data-qa="drawer-close" @click="close">
            <PhX :size="20" />
          </BaseButton>
        </div>
        <div class="rib"></div>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>
