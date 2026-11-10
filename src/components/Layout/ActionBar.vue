<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

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
const barClass = computed(() => (isHidden.value ? "translate-y-[calc(100%+2rem)] motion-reduce:translate-y-0 motion-reduce:opacity-0" : ""));

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
    class="night fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-20 flex h-16 items-center gap-2 rounded-full bg-night/80 p-2 backdrop-blur-xl duration-300 ease-settle motion-safe:transition-transform motion-reduce:transition-opacity desk:hidden [@media(max-height:500px)]:hidden"
  >
    <LayoutMainAction size="sm" class="flex-1" />
    <BaseButton variant="ghost" size="icon" :href="site.tel_href">
      <PhPhone class="shrink-0" />
    </BaseButton>
  </div>
</template>
