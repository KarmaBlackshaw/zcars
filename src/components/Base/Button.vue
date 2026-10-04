<script setup lang="ts">
defineOptions({ name: "BaseButton" });

const {
  href,
  variant = "primary",
  size = "md",
} = defineProps<{
  href?: string;
  variant?: "primary" | "ghost";
  size?: "md" | "sm" | "icon";
}>();

const tag = computed(() => (href ? "a" : "button"));
const buttonType = computed(() => (href ? undefined : "button"));
const isExternal = computed(() => href?.startsWith("https://") ?? false);
const target = computed(() => (isExternal.value ? "_blank" : undefined));
const rel = computed(() => (isExternal.value ? "noopener" : undefined));

const variantClasses = {
  primary: "bg-accent text-white hover:bg-brilliantBlue focus-visible:outline-fg",
  ghost: "border border-muted/70 hover:border-fg",
};

const sizeClasses = {
  md: "min-h-12 px-[1.375rem] py-3.5",
  sm: "min-h-11 px-4 py-2.5 text-small",
  icon: "size-11 p-0",
};
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="buttonType"
    :target="target"
    :rel="rel"
    :class="[
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,background-color,border-color] duration-300 ease-settle aria-disabled:cursor-not-allowed aria-disabled:opacity-70 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[.98]',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <slot></slot>
    <span v-if="isExternal" class="sr-only"> (opens in new tab)</span>
  </component>
</template>
