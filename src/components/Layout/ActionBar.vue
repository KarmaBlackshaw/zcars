<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "LayoutActionBar" });

const isHeroVisible = ref(true);
const isVisitVisible = ref(false);
const heroActions = ref<HTMLElement>();
const visit = ref<HTMLElement>();

useIntersectionObserver(heroActions, ([entry]) => {
  isHeroVisible.value = entry?.isIntersecting ?? false;
});

useIntersectionObserver(visit, ([entry]) => {
  isVisitVisible.value = entry?.isIntersecting ?? false;
});

const isHidden = computed(() => isHeroVisible.value || isVisitVisible.value);
const barClass = computed(() => (isHidden.value ? "translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0" : ""));

onMounted(() => {
  heroActions.value = document.getElementById("hero-actions") ?? undefined;
  visit.value = document.getElementById("visit") ?? undefined;
});
</script>

<template>
  <nav
    aria-label="Quick contact"
    :inert="isHidden"
    :aria-hidden="isHidden"
    :class="barClass"
    class="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg duration-300 ease-settle motion-safe:transition-transform motion-reduce:transition-opacity desk:hidden [@media(max-height:500px)]:hidden"
  >
    <div class="grid grid-cols-[1fr_auto] items-center gap-2 px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2">
      <LayoutMainAction size="sm" class="w-full" />
      <BaseButton variant="text" size="sm" :href="site.tel_href">
        <PhPhone class="shrink-0" />
        Call
      </BaseButton>
    </div>
  </nav>
</template>
