<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";
import logo from "@/assets/images/logo.webp";

defineOptions({ name: "LayoutNav" });

const links = useNavLinks();
const brandLabel = `${site.name}, home`;
const callLabel = `Call ${site.phone_display}`;
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-line bg-bg/[.82] backdrop-blur-[14px]">
    <BaseContainer class="flex h-nav items-center justify-between gap-4">
      <a href="#top" :aria-label="brandLabel" class="flex items-center gap-3 font-bold [font-stretch:115%]">
        <img :src="logo" alt="" width="40" height="40" class="size-10 rounded-full" />
        Zcars
      </a>
      <nav aria-label="Primary" class="hidden desk:block">
        <ul class="flex gap-6">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="font-medium text-muted hover:text-fg">{{ link.label }}</a>
          </li>
        </ul>
      </nav>
      <div class="flex items-center gap-2">
        <BaseButton size="sm" href="#quote">Get a quote</BaseButton>
        <BaseButton variant="ghost" size="icon" :href="site.tel_href" :aria-label="callLabel" class="text-small min-[1100px]:w-auto min-[1100px]:px-4">
          <PhPhone aria-hidden="true" class="shrink-0" />
          <span class="hidden min-[1100px]:inline">Call {{ site.phone_display }}</span>
        </BaseButton>
      </div>
    </BaseContainer>
  </header>
</template>
