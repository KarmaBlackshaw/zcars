<script setup lang="ts">
import { controlClasses } from "@/constants/form";

defineOptions({ name: "BaseTextarea" });
</script>

<template>
  <textarea :class="[controlClasses, 'resize-y py-3']"></textarea>
</template>
