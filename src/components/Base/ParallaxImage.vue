<script setup lang="ts">
import { motion, useReducedMotion, useScroll, useTransform } from "motion-v";

defineOptions({ name: "BaseParallaxImage" });

const image = useTemplateRef("image");
const { scrollYProgress } = useScroll({ target: image, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
const isReducedMotion = useReducedMotion();
const style = computed(() => (isReducedMotion.value ? undefined : { y, scale: 1.12 }));
</script>

<template>
  <motion.img ref="image" :style="style" />
</template>
