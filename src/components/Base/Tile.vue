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
  tone?: "surface" | "accent" | "night";
  padding?: "none" | "md" | "lg";
}>();

const tag = computed(() => (href ? "a" : as));
const linkAttrs = computed(() => getLinkAttrs(href));
const buttonType = computed(() => (!href && as === "button" ? "button" : undefined));
const isInteractive = computed(() => href != null || as === "button");

const toneClasses = {
  surface: "bg-surface shadow-tile",
  accent: "bg-accent text-white",
  night: "night bg-night",
};

const interactiveClasses = "transition-[transform,box-shadow] duration-300 ease-settle motion-safe:hover:-translate-y-1 hover:shadow-lift";

const paddingClasses = {
  none: "",
  md: "p-5 desk:p-7",
  lg: "p-6 desk:p-8",
};

const classes = computed(() => ["rounded-xl overflow-hidden", toneClasses[tone], paddingClasses[padding], isInteractive.value && interactiveClasses]);
</script>

<template>
  <component :is="tag" :href="href" :type="buttonType" v-bind="linkAttrs" :class="classes">
    <slot></slot>
  </component>
</template>
