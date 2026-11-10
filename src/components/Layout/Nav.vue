<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

import { LOGO_PATH } from "@/constants/brand";

defineOptions({ name: "LayoutNav" });

const links = useNavLinks();
const isMounted = useMounted();
const { y } = useWindowScroll();

const isScrolled = computed(() => isMounted.value && y.value > 8);
const surfaceClass = computed(() => (isScrolled.value ? "bg-night/88" : "bg-night/72"));

const linkClass =
  "relative font-medium text-small text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-fg after:transition-transform after:duration-300 after:ease-settle hover:after:scale-x-100";
</script>

<template>
  <header
    :class="[
      'night fixed inset-x-3 top-3 z-20 h-14 rounded-full ring-1 ring-white/10 backdrop-blur-xl transition-colors duration-200 motion-reduce:transition-none desk:inset-x-4 desk:top-4 desk:rounded-2xl',
      surfaceClass,
    ]"
  >
    <div class="flex h-full items-center justify-between gap-4 px-3 desk:px-5">
      <a href="/" class="flex items-center gap-2.5">
        <img :src="LOGO_PATH" alt="Zcars" width="32" height="32" class="size-8 rounded-lg" />
        <span class="text-lg font-[750] text-fg">Zcars</span>
      </a>
      <ul class="hidden gap-5 desk:flex min-[1100px]:gap-7">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" :class="linkClass">{{ link.label }}</a>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <BaseButton variant="ghost" size="icon" :href="site.tel_href" class="min-[1100px]:hidden">
          <PhPhone class="shrink-0" />
        </BaseButton>
        <LayoutCallAction size="sm" class="hidden min-[1100px]:inline-flex" />
        <LayoutMainAction size="sm" class="hidden desk:inline-flex" />
      </div>
    </div>
  </header>
</template>
