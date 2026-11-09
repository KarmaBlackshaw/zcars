<script setup lang="ts">
defineOptions({ name: "BaseThumbnails" });

const { items } = defineProps<{ items: { src: string; alt: string }[] }>();

const selected = defineModel<number>({ default: 0 });
</script>

<template>
  <div class="flex gap-2 overflow-x-auto">
    <button
      v-for="(item, index) in items"
      :key="item.src"
      type="button"
      class="shrink-0 rounded-lg border-2 p-0.5 transition"
      :class="index === selected ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'"
      @click="selected = index"
    >
      <img :src="item.src" :alt="item.alt" draggable="false" class="aspect-[4/3] w-16 rounded-md bg-surface object-cover" />
    </button>
  </div>
</template>
