<script setup lang="ts">
import { images } from "virtual:content";

defineOptions({ name: "BaseImage" });

const { src } = defineProps<{ src: string }>();

const image = computed(() => images[src]);
</script>

<template>
  <img :src="image?.src ?? src" :srcset="image?.srcset" />
</template>
