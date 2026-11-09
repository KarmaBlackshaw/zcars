const isOpen = ref(false);
const service = ref("");

export function useQuoteDrawer() {
  function open(serviceTitle = "") {
    service.value = serviceTitle;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  function selectService(serviceTitle: string) {
    service.value = serviceTitle;
  }

  return { isOpen: readonly(isOpen), service: readonly(service), open, close, selectService };
}
