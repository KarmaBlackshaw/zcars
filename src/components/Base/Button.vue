<script setup lang="ts">
defineOptions({ name: "BaseButton" });

const {
  href,
  variant = "primary",
  size = "md",
} = defineProps<{
  href?: string;
  variant?: "primary" | "light" | "dark" | "text";
  size?: "md" | "sm" | "icon";
}>();

const tag = computed(() => (href ? "a" : "button"));
const buttonType = computed(() => (href ? undefined : "button"));
const linkAttrs = computed(() => getLinkAttrs(href));

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-[transform,filter,color] duration-300 ease-settle aria-disabled:cursor-not-allowed aria-disabled:opacity-70 disabled:cursor-not-allowed disabled:opacity-70";

const slantClasses = "clip-slant font-display italic uppercase text-button hover:brightness-110 motion-safe:active:translate-y-px";

const variantClasses = {
  primary: `${slantClasses} bg-accent text-white`,
  light: `${slantClasses} bg-blackHaze text-night`,
  dark: `${slantClasses} bg-night text-white`,
  text: "text-link font-semibold underline-offset-4 hover:underline",
};

const sizeClasses = {
  md: "h-12 px-8",
  sm: "h-10 px-6",
  icon: "size-11 p-0 [--slant:8px]",
};

const textSizeClasses = {
  md: "min-h-14",
  sm: "min-h-11 text-small",
  icon: "size-11",
};

const classes = computed(() => [baseClasses, variantClasses[variant], variant === "text" ? textSizeClasses[size] : sizeClasses[size]]);
</script>

<template>
  <component :is="tag" :href="href" :type="buttonType" v-bind="linkAttrs" :class="classes">
    <slot></slot>
  </component>
</template>
