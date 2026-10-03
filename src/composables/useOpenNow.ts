import { site } from "virtual:content";

import type { TOpenStatus, TWeekday } from "@/types";

export const useOpenNow = createSharedComposable(() => {
  const status = ref<TOpenStatus>();
  const today = ref<TWeekday>();

  function refresh() {
    const next = getOpenStatus(site.hours, new Date());

    status.value = next;
    today.value = next.day;
  }

  const interval = useIntervalFn(refresh, 60_000, { immediate: false });

  onMounted(() => {
    if (site.hours.length > 0) {
      refresh();
      interval.resume();
    }
  });

  return { status: readonly(status), today: readonly(today) };
});
