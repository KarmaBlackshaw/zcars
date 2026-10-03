<script setup lang="ts">
import { controlClasses } from "@/constants/form";

defineOptions({ name: "BaseInput" });

const inputRef = useTemplateRef("inputEl");

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<template>
  <input ref="inputEl" :class="controlClasses" />
</template>
