<script setup lang="ts">
import { PhWarningCircle } from "@phosphor-icons/vue";

defineOptions({ name: "HomeQuoteField" });

const {
  id,
  label,
  isRequired = false,
  helper,
  error,
} = defineProps<{
  id: string;
  label: string;
  isRequired?: boolean;
  helper?: string;
  error?: string;
}>();

const helperId = computed(() => `${id}-helper`);
const errorId = computed(() => `${id}-error`);
const requirementText = computed(() => (isRequired ? "(required)" : "(optional)"));

const describedBy = computed(() => {
  const ids = [helper ? helperId.value : "", error ? errorId.value : ""].filter(Boolean);

  return ids.length ? ids.join(" ") : undefined;
});
</script>

<template>
  <div class="grid gap-2">
    <slot name="label" :requirement-text="requirementText">
      <label :for="id" class="font-semibold"
        >{{ label }} <span class="font-normal text-muted">{{ requirementText }}</span></label
      >
    </slot>
    <slot :described-by="describedBy"></slot>
    <p v-if="helper" :id="helperId" class="text-micro text-muted">{{ helper }}</p>
    <p v-if="error" :id="errorId" class="flex items-center gap-1.5 text-small text-danger">
      <PhWarningCircle aria-hidden="true" class="shrink-0" />
      {{ error }}
    </p>
  </div>
</template>
