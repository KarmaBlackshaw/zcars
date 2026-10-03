const selectedService = ref("");

export function useQuoteService() {
  const reducedMotion = usePreferredReducedMotion();

  function select(title: string) {
    selectedService.value = title;
  }

  function jumpToField() {
    const field = document.getElementById("quote-service");

    if (field != null) {
      const isReducedMotion = reducedMotion.value === "reduce";

      field.scrollIntoView({ behavior: isReducedMotion ? "auto" : "smooth", block: "center" });
      field.focus({ preventScroll: true });
    }
  }

  return { selectedService: readonly(selectedService), select, jumpToField };
}
