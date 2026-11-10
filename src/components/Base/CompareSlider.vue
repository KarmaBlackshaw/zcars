<script setup lang="ts">
import { PhArrowsLeftRight } from "@phosphor-icons/vue";

defineOptions({ name: "BaseCompareSlider" });

const { before, after, alt } = defineProps<{ before: string; after: string; alt: string }>();

const container = useTemplateRef("containerEl");
const position = ref(50);
const isDragging = ref(false);

const beforeStyle = computed(() => ({ clipPath: `inset(0 ${100 - position.value}% 0 0)` }));
const handleStyle = computed(() => ({ left: `${position.value}%` }));

function moveTo(event: PointerEvent) {
  const rect = container.value?.getBoundingClientRect();

  if (rect != null) {
    position.value = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
  }
}

function onPointerdown(event: PointerEvent) {
  isDragging.value = true;
  container.value?.setPointerCapture(event.pointerId);
  moveTo(event);
}

function onPointermove(event: PointerEvent) {
  if (isDragging.value) {
    moveTo(event);
  }
}

function stopDragging() {
  isDragging.value = false;
}
</script>

<template>
  <div
    ref="containerEl"
    class="relative cursor-ew-resize touch-pan-y select-none overflow-hidden"
    @pointerdown="onPointerdown"
    @pointermove="onPointermove"
    @pointerup="stopDragging"
    @pointercancel="stopDragging"
  >
    <img :src="after" :alt="alt" fetchpriority="high" draggable="false" class="absolute inset-0 size-full object-cover" />
    <img :src="before" alt="" draggable="false" class="absolute inset-0 size-full object-cover" :style="beforeStyle" />
    <span class="absolute left-3 top-3 rounded-md bg-inkBlack/70 px-2 py-1 text-micro font-semibold text-sportyWhite">Before</span>
    <span class="absolute right-3 top-3 rounded-md bg-inkBlack/70 px-2 py-1 text-micro font-semibold text-sportyWhite">After</span>
    <div class="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" :style="handleStyle">
      <span
        class="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-inkBlack shadow-lg transition-transform duration-300 ease-settle"
        :class="{ 'scale-110': isDragging }"
      >
        <PhArrowsLeftRight :size="20" weight="bold" />
      </span>
    </div>
  </div>
</template>
