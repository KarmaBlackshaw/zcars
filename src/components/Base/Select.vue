<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";
import { controlClasses } from "@/constants/form";

defineOptions({ name: "BaseSelect", inheritAttrs: false });

const { options } = defineProps<{ options: string[] }>();
</script>

<template>
  <div class="relative">
    <select v-bind="$attrs" :class="[controlClasses, 'cursor-pointer appearance-none pr-11']">
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
    <PhCaretDown aria-hidden="true" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
  </div>
</template>
