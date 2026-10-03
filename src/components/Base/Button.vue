<script setup lang="ts">
defineOptions({ name: "BaseButton" });

const {
  href,
  variant = "primary",
  size = "md",
} = defineProps<{
  href: string;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
}>();

const variantClasses = {
  primary: "bg-accent text-white hover:bg-brilliantBlue",
  ghost: "border border-line hover:border-muted",
};

const sizeClasses = {
  md: "px-[1.375rem] py-3.5",
  sm: "px-4 py-2.5 text-small",
};
</script>

<template>
  <a
    :href="href"
    :class="[
      'inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,background-color,border-color] duration-300 ease-settle motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[.98]',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <slot></slot>
  </a>
</template>
