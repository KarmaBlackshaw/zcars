<script setup lang="ts">
defineOptions({ name: "BaseButton" });

const {
  href,
  variant = "primary",
  size = "md",
} = defineProps<{
  href?: string;
  variant?: "primary" | "ghost" | "text" | "onBrand";
  size?: "md" | "sm" | "icon";
}>();

const tag = computed(() => (href ? "a" : "button"));
const buttonType = computed(() => (href ? undefined : "button"));
const isExternal = computed(() => href?.startsWith("https://") ?? false);
const target = computed(() => (isExternal.value ? "_blank" : undefined));
const rel = computed(() => (isExternal.value ? "noopener" : undefined));

const lift = "motion-safe:hover:-translate-y-px motion-safe:active:scale-[.98]";

const variantClasses = {
  primary: `bg-accent text-white hover:bg-brand focus-visible:outline-fg ${lift}`,
  ghost: `border border-muted/70 hover:border-fg ${lift}`,
  text: "text-accent-text underline-offset-4 hover:underline",
  onBrand: `bg-accent text-white hover:bg-brand-highlight hover:text-brand focus-visible:outline-brand-highlight ${lift}`,
};

const sizeClasses = {
  md: "min-h-12 px-[1.375rem] py-3.5",
  sm: "min-h-11 px-4 py-2.5 text-small",
  icon: "size-11 p-0",
};

const textSizeClasses = {
  md: "min-h-12",
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
    :target="target"
    :rel="rel"
    :class="[
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-semibold transition-[transform,background-color,border-color,color] duration-300 ease-settle aria-disabled:cursor-not-allowed aria-disabled:opacity-70',
      variantClasses[variant],
      sizeClass,
    ]"
  >
    <slot></slot>
    <span v-if="isExternal" class="sr-only"> (opens in new tab)</span>
  </component>
</template>
