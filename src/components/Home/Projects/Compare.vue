<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";

defineOptions({ name: "HomeProjectsCompare" });

const { before, beforeAlt, after, afterAlt } = defineProps<{
  before: string;
  beforeAlt: string;
  after: string;
  afterAlt: string;
}>();

const position = ref(50);

const positionStyle = computed(() => ({ "--pos": `${position.value}%` }));
const valueText = computed(() => `Showing ${position.value} percent before`);
const beforeLabel = computed(() => `Before: ${beforeAlt}`);
const afterLabel = computed(() => `After: ${afterAlt}`);
</script>

<template>
  <div class="flex size-full flex-col gap-2">
    <div class="relative min-h-0 flex-1 overflow-hidden" :style="positionStyle">
      <img :src="after" :alt="afterLabel" class="size-full object-cover" />
      <img :src="before" :alt="beforeLabel" class="absolute inset-0 size-full object-cover [clip-path:inset(0_calc(100%-var(--pos))_0_0)]" />
      <input
        v-model.number="position"
        type="range"
        min="0"
        max="100"
        step="1"
        aria-label="Before and after comparison"
        :aria-valuetext="valueText"
        class="peer absolute inset-0 size-full cursor-ew-resize touch-pan-y opacity-0"
      />
      <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-0.5 -translate-x-1/2 bg-fg"></div>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-[var(--pos)] top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-bg ring-2 ring-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent-text"
      >
        <span class="flex">
          <PhCaretLeft :size="16" weight="bold" />
          <PhCaretRight :size="16" weight="bold" />
        </span>
      </div>
    </div>
    <div class="flex justify-between text-micro text-muted">
      <span>Before</span>
      <span>After</span>
    </div>
  </div>
</template>
