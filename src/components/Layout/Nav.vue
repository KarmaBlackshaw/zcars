<script setup lang="ts">
import { site } from "virtual:content";

import { LOGO_PATH } from "@/constants/brand";
import type { TNavLink } from "@/types";
import PhPhone from "~icons/ph/phone";

defineOptions({ name: "LayoutNav" });

const links = useNavLinks();
const route = useRoute();

const ACTIVE_OFFSET = 96;
const sectionIds = links.filter(({ href }) => href.startsWith("/#")).map(({ href }) => href.slice(2));
const activeSection = useScrollSpy(sectionIds, ACTIVE_OFFSET);

const [brand, ...rest] = site.name.split(" ");
const tagline = rest.join(" ");

const tabBaseClasses = "relative inline-flex h-full items-center px-3 min-[1100px]:px-4 font-display italic uppercase text-nav transition-colors hover:text-fg";
const tabActiveClasses = `${tabBaseClasses} text-accent after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-accent`;
const tabInactiveClasses = `${tabBaseClasses} text-muted`;

function isActive(link: TNavLink) {
  if (route.path === "/") {
    return link.href === (activeSection.value ? `/#${activeSection.value}` : "/");
  }

  return link.href === "/#services" && route.path.startsWith("/services/");
}

function tabClass(link: TNavLink) {
  return isActive(link) ? tabActiveClasses : tabInactiveClasses;
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-surface desk:-top-[4.5rem]">
    <BaseContainer>
      <div class="flex h-[3.75rem] items-center justify-between gap-4 desk:h-[4.5rem]">
        <a href="/" class="flex items-center gap-3">
          <img :src="LOGO_PATH" alt="Zcars" width="40" height="40" class="size-10" />
          <span>
            <span class="block font-display text-tile-title uppercase italic">{{ brand }}</span>
            <span v-if="tagline" class="hidden font-display text-label uppercase italic text-muted desk:block">{{ tagline }}</span>
          </span>
        </a>
        <a :href="site.tel_href" class="hidden font-display text-card-title uppercase italic text-fg hover:text-accent desk:inline">
          Call {{ site.phone_display }}
        </a>
        <BaseButton variant="dark" size="icon" :href="site.tel_href" class="desk:hidden">
          <PhPhone class="shrink-0" />
        </BaseButton>
      </div>
    </BaseContainer>
    <div class="hidden border-b border-line desk:block">
      <BaseContainer>
        <div class="flex h-[2.875rem] items-center justify-between">
          <ul class="flex h-full">
            <li v-for="link in links" :key="link.href" class="h-full">
              <a :href="link.href" :class="tabClass(link)">{{ link.label }}</a>
            </li>
          </ul>
          <LayoutMainAction size="sm" class="hidden desk:inline-flex" />
        </div>
      </BaseContainer>
    </div>
  </header>
</template>
