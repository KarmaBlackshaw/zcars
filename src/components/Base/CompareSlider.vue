<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";

defineOptions({ name: "BaseCompareSlider" });

const { before, after, alt, sizes, focus = "50% 50%" } = defineProps<{ before: string; after: string; alt: string; sizes?: string; focus?: string }>();

const position = defineModel<number>("position", { default: 50 });

const container = useTemplateRef("containerEl");
const isDragging = ref(false);

const imageStyle = computed(() => ({ objectPosition: focus }));
const beforeStyle = computed(() => ({ ...imageStyle.value, clipPath: `inset(0 ${100 - position.value}% 0 0)` }));
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
    <BaseImage :src="after" :alt="alt" :sizes="sizes" loading="lazy" draggable="false" class="absolute inset-0 size-full object-cover" :style="imageStyle" />
    <BaseImage :src="before" alt="" :sizes="sizes" loading="lazy" draggable="false" class="absolute inset-0 size-full object-cover" :style="beforeStyle" />
    <BaseChip class="absolute left-3 top-3">Before</BaseChip>
    <BaseChip class="absolute right-3 top-3">After</BaseChip>
    <div class="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent" :style="handleStyle">
      <span
        class="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 ease-settle"
        :class="{ 'scale-110': isDragging }"
      >
        <PhCaretLeft :size="16" weight="bold" />
        <PhCaretRight :size="16" weight="bold" />
      </span>
    </div>
  </div>
</template>
