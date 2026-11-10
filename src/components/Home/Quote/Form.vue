<script setup lang="ts">
import { PhCheckCircle, PhCircleNotch, PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { services, site } from "virtual:content";
import type { TQuoteField } from "@/types";

defineOptions({ name: "HomeQuoteForm" });

const form = useQuoteForm();
const quoteDrawer = useQuoteDrawer();
const { status, errors, errorCount } = form;

const formRef = useTemplateRef("formEl");
const successRef = useTemplateRef("successEl");
const photoRef = useTemplateRef("photoEl");
const nameRef = useTemplateRef("nameEl");

const NOT_SURE = "Not sure";
const serviceOptions = [NOT_SURE, ...services.map(({ title }) => title)];

const photoButtonClasses =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded border border-muted/60 bg-surface px-4 py-2.5 text-small font-semibold transition-colors hover:border-muted peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-accent-text peer-aria-[invalid=true]:border-danger";

const isEnhanced = ref(false);
const hasAttemptedSubmit = ref(false);
const photoName = ref<string>();
const touchedFields = new Set<TQuoteField>();

const isSubmitting = computed(() => status.value === "submitting");
const serviceValue = computed(() => quoteDrawer.service.value || NOT_SURE);
const fieldWord = computed(() => (errorCount.value === 1 ? "field" : "fields"));
const isSummaryShown = computed(() => hasAttemptedSubmit.value && errorCount.value > 0);

onMounted(() => {
  isEnhanced.value = true;
});

function isInvalid(field: TQuoteField) {
  return Boolean(errors.value[field]);
}

function validate(field: TQuoteField) {
  const formElement = formRef.value;

  if (formElement != null) {
    form.validateField(formElement, field);
  }
}

function onInput(field: TQuoteField) {
  touchedFields.add(field);

  if (errors.value[field] != null) {
    validate(field);
  }
}

function onBlur(field: TQuoteField) {
  if (touchedFields.has(field) || hasAttemptedSubmit.value) {
    validate(field);
  }
}

function onServiceChange(event: Event) {
  if (event.target instanceof HTMLSelectElement) {
    quoteDrawer.selectService(event.target.value);
  }
}

function onPhotoChange(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    photoName.value = event.target.files?.[0]?.name;
  }

  validate("photo");
}

function removePhoto() {
  const photoInput = photoRef.value;

  if (photoInput != null) {
    photoInput.value = "";
    photoInput.focus();
  }

  photoName.value = undefined;
  validate("photo");
}

async function onSubmit() {
  const formElement = formRef.value;

  if (formElement == null) {
    return;
  }

  hasAttemptedSubmit.value = true;
  await form.submit(formElement);

  if (status.value === "success") {
    await nextTick();
    successRef.value?.focus();
  }
}

function resetForm() {
  form.reset();
  touchedFields.clear();
  hasAttemptedSubmit.value = false;
  photoName.value = undefined;
}

async function startNewRequest() {
  resetForm();
  quoteDrawer.selectService("");
  await nextTick();
  nameRef.value?.focus();
}

watch(quoteDrawer.isOpen, (isOpen) => {
  if (isOpen && status.value === "success") {
    resetForm();
  }
});
</script>

<template>
  <div v-if="status === 'success'" ref="successEl" role="status" tabindex="-1" class="grid justify-items-start gap-5">
    <PhCheckCircle :size="40" weight="fill" aria-hidden="true" class="text-success" />
    <p class="text-lead font-semibold">Got it. We will call or message you soon.</p>
    <div class="flex flex-wrap gap-3">
      <BaseButton :href="site.messenger_url">
        <PhMessengerLogo aria-hidden="true" class="shrink-0" />
        Message us
      </BaseButton>
      <BaseButton variant="text" :href="site.tel_href">
        <PhPhone aria-hidden="true" class="shrink-0" />
        Call
      </BaseButton>
    </div>
    <BaseButton variant="text" size="sm" @click="startNewRequest">Send another request</BaseButton>
  </div>
  <form v-else ref="formEl" name="quote" class="grid gap-5" :novalidate="isEnhanced" @submit.prevent="onSubmit">
    <p class="absolute -left-[9999px]" aria-hidden="true">
      <label>Company <input name="company" tabindex="-1" autocomplete="off" /></label>
    </p>
    <HomeQuoteField id="quote-photo" label="Photo" :error="errors.photo">
      <template #label="{ requirementText }">
        <p class="font-semibold">
          Photo of the car <span class="font-normal text-muted">{{ requirementText }}</span>
        </p>
      </template>
      <template #default="{ describedBy }">
        <div class="flex flex-wrap items-center gap-3">
          <input
            id="quote-photo"
            ref="photoEl"
            name="photo"
            type="file"
            accept="image/*"
            class="peer sr-only"
            :aria-invalid="isInvalid('photo')"
            :aria-describedby="describedBy"
            @change="onPhotoChange"
          />
          <label for="quote-photo" :class="photoButtonClasses">Add a photo (up to 7 MB)</label>
          <template v-if="photoName">
            <span class="min-w-0 break-all text-small text-muted">{{ photoName }}</span>
            <BaseButton variant="text" size="sm" @click="removePhoto">Remove</BaseButton>
          </template>
        </div>
      </template>
    </HomeQuoteField>
    <HomeQuoteField v-slot="{ describedBy }" id="quote-name" label="Name" is-required :error="errors.name">
      <BaseInput
        id="quote-name"
        ref="nameEl"
        name="name"
        required
        autocomplete="name"
        :aria-invalid="isInvalid('name')"
        :aria-describedby="describedBy"
        @input="onInput('name')"
        @blur="onBlur('name')"
      />
    </HomeQuoteField>
    <HomeQuoteField v-slot="{ describedBy }" id="quote-phone" label="Phone" is-required helper="We will call or text this number." :error="errors.phone">
      <BaseInput
        id="quote-phone"
        name="phone"
        type="tel"
        inputmode="tel"
        required
        autocomplete="tel"
        :aria-invalid="isInvalid('phone')"
        :aria-describedby="describedBy"
        @input="onInput('phone')"
        @blur="onBlur('phone')"
      />
    </HomeQuoteField>
    <HomeQuoteField v-slot="{ describedBy }" id="quote-vehicle" label="Vehicle" is-required :error="errors.vehicle">
      <BaseInput
        id="quote-vehicle"
        name="vehicle"
        required
        placeholder="e.g. 2019 Toyota Vios"
        :aria-invalid="isInvalid('vehicle')"
        :aria-describedby="describedBy"
        @input="onInput('vehicle')"
        @blur="onBlur('vehicle')"
      />
    </HomeQuoteField>
    <HomeQuoteField v-slot="{ describedBy }" id="quote-service" label="Service">
      <BaseSelect id="quote-service" name="service" :options="serviceOptions" :value="serviceValue" :aria-describedby="describedBy" @change="onServiceChange" />
    </HomeQuoteField>
    <HomeQuoteField v-slot="{ describedBy }" id="quote-message" label="Message">
      <BaseTextarea id="quote-message" name="message" rows="3" placeholder="What does the car need?" :aria-describedby="describedBy" />
    </HomeQuoteField>
    <div class="grid gap-4">
      <p v-if="isSummaryShown" role="alert" class="text-danger">Please fix {{ errorCount }} {{ fieldWord }}</p>
      <div v-if="status === 'error'" role="alert" class="grid justify-items-start gap-3">
        <p class="text-danger">That did not send. Check your connection and try again, or message us.</p>
        <BaseButton variant="text" size="sm" :href="site.messenger_url">Message us instead</BaseButton>
      </div>
      <BaseButton type="submit" :aria-disabled="isSubmitting" :aria-busy="isSubmitting" class="w-full">
        <template v-if="isSubmitting">
          <PhCircleNotch aria-hidden="true" class="shrink-0 motion-safe:animate-spin" />
          Sending
        </template>
        <template v-else>Send quote request</template>
      </BaseButton>
    </div>
  </form>
</template>
