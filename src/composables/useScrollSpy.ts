export function useScrollSpy(ids: string[], offset: number) {
  const { y } = useWindowScroll();
  const isMounted = useMounted();

  return computed(() => {
    if (!isMounted.value) {
      return undefined;
    }

    void y.value;

    let activeId: string | undefined;
    let activeTop = -Infinity;

    for (const id of ids) {
      const element = document.getElementById(id);

      if (element == null) {
        continue;
      }

      const { top } = element.getBoundingClientRect();

      if (top <= offset && top > activeTop) {
        activeId = id;
        activeTop = top;
      }
    }

    return activeId;
  });
}
