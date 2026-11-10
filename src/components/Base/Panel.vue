<script setup lang="ts">
defineOptions({ name: "BasePanel" });

const { tone = "night" } = defineProps<{
  tone?: "night" | "accent";
}>();

const toneClasses = {
  night: "night bg-night",
  accent: "bg-accent text-white",
};
</script>

<template>
  <section :class="['mx-3 scroll-mt-nav rounded-[2rem] desk:mx-4', toneClasses[tone]]">
    <div class="mx-auto max-w-[88rem] px-3 desk:px-12">
      <slot></slot>
    </div>
  </section>
</template>
