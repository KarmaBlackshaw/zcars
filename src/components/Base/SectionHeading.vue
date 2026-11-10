<script setup lang="ts">
defineOptions({ name: "BaseSectionHeading" });

const {
  title,
  lead,
  layout = "stacked",
} = defineProps<{
  title: string;
  lead?: string;
  layout?: "stacked" | "split";
}>();

defineSlots<{ action?(): unknown }>();

const layoutClasses = {
  stacked: { root: "", title: "", aside: "", lead: "mt-5", action: "mt-6" },
  split: {
    root: "desk:grid desk:grid-cols-12 desk:items-end desk:gap-4",
    title: "desk:col-span-7",
    aside: "desk:col-span-4 desk:col-start-9",
    lead: "mt-5 desk:mt-0",
    action: "mt-6 desk:flex desk:justify-end",
  },
};

const actionClass = computed(() => (layout === "split" && lead == null ? `${layoutClasses.split.action} desk:mt-0` : layoutClasses[layout].action));
</script>

<template>
  <div class="reveal" :class="layoutClasses[layout].root">
    <h2 :class="layoutClasses[layout].title">{{ title }}</h2>
    <div v-if="lead || $slots.action" :class="layoutClasses[layout].aside">
      <p v-if="lead" class="max-w-[46ch] text-lead text-muted" :class="layoutClasses[layout].lead">
        {{ lead }}
      </p>
      <div v-if="$slots.action" :class="actionClass">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>
