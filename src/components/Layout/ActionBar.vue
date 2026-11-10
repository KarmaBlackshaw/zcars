<script setup lang="ts">
import { site } from "virtual:content";
import PhPhone from "~icons/ph/phone";

defineOptions({ name: "LayoutActionBar" });

const bar = ref<HTMLElement>();
const targets = ref<HTMLElement[]>([]);
const visibleTargets = reactive(new Set<HTMLElement>());
const hasReported = ref(false);

useIntersectionObserver(targets, (entries) => {
  for (const { target, isIntersecting } of entries) {
    if (!(target instanceof HTMLElement)) {
      continue;
    }

    if (isIntersecting) {
      visibleTargets.add(target);
    } else {
      visibleTargets.delete(target);
    }
  }

  hasReported.value = true;
});

const isHidden = computed(() => !hasReported.value || visibleTargets.size > 0);
const barClass = computed(() => (isHidden.value ? "translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0" : ""));

onMounted(() => {
  const pills = document.querySelectorAll("[data-main-action]");
  targets.value = [...pills].flatMap((pill) => (pill instanceof HTMLElement && !bar.value?.contains(pill) ? pill : []));
  hasReported.value = targets.value.length === 0;
});
</script>

<template>
  <div
    ref="bar"
    :class="barClass"
    class="night fixed inset-x-0 bottom-0 z-20 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center gap-2 bg-night px-3 pb-[env(safe-area-inset-bottom)] duration-300 ease-settle motion-safe:transition-transform motion-reduce:transition-opacity desk:hidden [@media(max-height:500px)]:hidden"
  >
    <LayoutMainAction size="sm" class="min-w-0 flex-1">
      <span class="max-[379px]:hidden">Send a photo on Messenger</span>
      <span class="min-[380px]:hidden">Send a photo</span>
    </LayoutMainAction>
    <BaseButton variant="light" size="icon" :href="site.tel_href" class="shrink-0">
      <PhPhone class="shrink-0" />
    </BaseButton>
  </div>
</template>
