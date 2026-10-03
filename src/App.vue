<script setup lang="ts">
import { MotionConfig } from "motion-v";

defineOptions({ name: "App" });
</script>

<template>
  <MotionConfig reduced-motion="user">
    <RouterView />
  </MotionConfig>
</template>
