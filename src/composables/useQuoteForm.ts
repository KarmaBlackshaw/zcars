import type { TQuoteErrors, TQuoteField, TQuoteStatus } from "@/types";

const MAX_PHOTO_BYTES = 7 * 1024 * 1024;

const QUOTE_FIELDS: TQuoteField[] = ["name", "phone", "vehicle", "photo"];

function getFieldError(form: HTMLFormElement, field: TQuoteField) {
  const input = form.elements.namedItem(field);
  const value = input instanceof HTMLInputElement ? input.value.trim() : "";

  switch (field) {
    case "name":
      return value === "" ? "Enter your name." : undefined;
    case "phone":
      return value.replace(/\D/g, "").length < 7 ? "Enter a phone number we can call." : undefined;
    case "vehicle":
      return value === "" ? "Enter your car's make and model." : undefined;
    case "photo": {
      const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;

      return file != null && file.size > MAX_PHOTO_BYTES ? "That photo is over 7 MB. Choose a smaller one." : undefined;
    }
  }
}

export function useQuoteForm() {
  const status = ref<TQuoteStatus>("idle");
  const errors = ref<TQuoteErrors>({});
  const errorCount = computed(() => Object.keys(errors.value).length);

  function validateField(form: HTMLFormElement, field: TQuoteField) {
    const message = getFieldError(form, field);
    const nextErrors = { ...errors.value };

    if (message != null) {
      nextErrors[field] = message;
    } else {
      delete nextErrors[field];
    }

    errors.value = nextErrors;
  }

  async function submit(form: HTMLFormElement) {
    if (status.value === "submitting") {
      return;
    }

    QUOTE_FIELDS.forEach((field) => validateField(form, field));

    if (errorCount.value > 0) {
      await nextTick();
      const invalidControl = form.querySelector('[aria-invalid="true"]');

      if (invalidControl instanceof HTMLElement) {
        invalidControl.focus();
      }

      return;
    }

    status.value = "submitting";

    try {
      const response = await fetch("/", { method: "POST", body: new FormData(form) });

      status.value = response.ok ? "success" : "error";
    } catch (error) {
      console.error(error);
      status.value = "error";
    }
  }

  function reset() {
    status.value = "idle";
    errors.value = {};
  }

  return { status: readonly(status), errors: readonly(errors), errorCount, validateField, submit, reset };
}
