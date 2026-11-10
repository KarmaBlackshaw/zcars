<script setup lang="ts">
defineOptions({ name: "BaseTile" });

const {
  href,
  as = "div",
  tone = "surface",
  padding = "md",
} = defineProps<{
  href?: string;
  as?: "div" | "li" | "button";
  tone?: "surface" | "accent";
  padding?: "none" | "md" | "lg";
}>();

const tag = computed(() => (href ? "a" : as));
const linkAttrs = computed(() => getLinkAttrs(href));
const buttonType = computed(() => (!href && as === "button" ? "button" : undefined));
const isInteractive = computed(() => href != null || as === "button");

const toneClasses = {
  surface: "bg-surface shadow-tile",
  accent: "bg-accent text-white",
};

const interactiveClasses = {
  surface: "hover:shadow-lift",
  accent: "hover:shadow-lift hover:bg-accent-hover",
};

const paddingClasses = {
  none: "",
  md: "p-5 desk:p-7",
  lg: "p-5 desk:p-10",
};

const classes = computed(() => [
  "rounded-2xl overflow-hidden",
  toneClasses[tone],
  paddingClasses[padding],
  isInteractive.value && ["transition-[box-shadow,background-color] duration-300 ease-settle", interactiveClasses[tone]],
]);
</script>

<template>
  <component :is="tag" :href="href" :type="buttonType" v-bind="linkAttrs" :class="classes">
    <slot></slot>
  </component>
</template>
