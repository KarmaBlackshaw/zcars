<script setup lang="ts">
defineOptions({ name: "BaseButton" });

const {
  href,
  variant = "primary",
  size = "md",
} = defineProps<{
  href?: string;
  variant?: "primary" | "ghost" | "text" | "navy" | "blue";
  size?: "lg" | "md" | "sm" | "icon";
}>();

const tag = computed(() => (href ? "a" : "button"));
const buttonType = computed(() => (href ? undefined : "button"));
const linkAttrs = computed(() => getLinkAttrs(href));

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-bold aria-disabled:cursor-not-allowed aria-disabled:opacity-60 disabled:cursor-not-allowed disabled:opacity-60";

const boxClasses =
  "whitespace-nowrap rounded text-button transition-[transform,background-color,border-color] duration-200 ease-settle motion-safe:active:translate-y-px";

const variantClasses = {
  primary: `${boxClasses} border-b-2 border-coveGray bg-[rgb(var(--btn-bg))] text-[rgb(var(--btn-fg))] hover:bg-[rgb(var(--btn-hover))]`,
  ghost: `${boxClasses} border-1.5 border-fg/60 text-fg hover:border-fg`,
  navy: `${boxClasses} bg-coveGray text-white hover:bg-mediumElectricBlue`,
  blue: `${boxClasses} border-b-2 border-coveGray bg-blueGrotto text-white hover:bg-mediumElectricBlue`,
  text: "text-link underline decoration-1 underline-offset-4 transition-[text-decoration-color] hover:decoration-2",
};

const sizeClasses = {
  lg: "h-[3.25rem] px-6",
  md: "h-12 px-5",
  sm: "h-11 px-4",
  icon: "size-12 p-0",
};

const textSizeClasses = {
  lg: "min-h-11",
  md: "min-h-11",
  sm: "min-h-11 text-small",
  icon: "size-12",
};

const classes = computed(() => [baseClasses, variantClasses[variant], variant === "text" ? textSizeClasses[size] : sizeClasses[size]]);
</script>

<template>
  <component :is="tag" :href="href" :type="buttonType" v-bind="linkAttrs" :class="classes">
    <slot></slot>
  </component>
</template>
