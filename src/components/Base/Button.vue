<script setup lang="ts">
defineOptions({ name: "BaseButton" });

const {
  href,
  variant = "primary",
  size = "md",
} = defineProps<{
  href?: string;
  variant?: "primary" | "ghost" | "text" | "inverse";
  size?: "md" | "sm" | "icon";
}>();

const tag = computed(() => (href ? "a" : "button"));
const buttonType = computed(() => (href ? undefined : "button"));
const linkAttrs = computed(() => getLinkAttrs(href));

const variantClasses = {
  primary: "rounded-full bg-accent text-white hover:bg-accent-hover focus-visible:outline-fg",
  ghost: "rounded-full text-fg ring-1 ring-fg/20 hover:ring-fg/40",
  text: "text-link underline-offset-4 hover:underline",
  inverse: "rounded-full bg-white text-accent hover:bg-white/90",
};

const sizeClasses = {
  md: "h-14 px-7",
  sm: "h-11 px-5 text-small",
  icon: "size-11 p-0",
};

const textSizeClasses = {
  md: "min-h-14",
  sm: "min-h-11 text-small",
  icon: "size-11",
};

const sizeClass = computed(() => (variant === "text" ? textSizeClasses[size] : sizeClasses[size]));
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="buttonType"
    v-bind="linkAttrs"
    :class="[
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[transform,background-color,box-shadow,color] duration-300 ease-settle aria-disabled:cursor-not-allowed aria-disabled:opacity-70 motion-safe:active:scale-[.98]',
      variantClasses[variant],
      sizeClass,
    ]"
  >
    <slot></slot>
  </component>
</template>
