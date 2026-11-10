export function useModalDialog(isOpen: MaybeRefOrGetter<boolean>, dialog: Readonly<Ref<HTMLDialogElement | null>>) {
  let isBackdropPress = false;

  watch(
    () => toValue(isOpen),
    (open) => {
      const element = dialog.value;

      if (element == null) {
        return;
      }

      if (open && !element.open) {
        element.showModal();
      } else if (!open && element.open) {
        element.close();
      }
    },
    { flush: "post" }
  );

  function close() {
    dialog.value?.close();
  }

  function onPointerdown(event: PointerEvent) {
    isBackdropPress = event.target === dialog.value;
  }

  function onClick(event: MouseEvent) {
    if (isBackdropPress && event.target === dialog.value) {
      close();
    }
  }

  return { close, onPointerdown, onClick };
}
