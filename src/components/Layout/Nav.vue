<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

import { LOGO_PATH } from "@/constants/brand";
import type { TNavLink } from "@/types";

defineOptions({ name: "LayoutNav" });

const links = useNavLinks();
const route = useRoute();
const { y } = useWindowScroll();

const ACTIVE_OFFSET = 96;
const sectionIds = links.filter(({ href }) => href.startsWith("/#")).map(({ href }) => href.slice(2));
const activeSection = useScrollSpy(sectionIds, ACTIVE_OFFSET);

const [brand, ...rest] = site.name.split(" ");
const tagline = rest.join(" ");

const isScrolled = computed(() => y.value > 40);

const linkBaseClasses =
  "relative inline-flex h-full items-center px-3 text-nav font-semibold transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:transition-colors min-[1100px]:px-4";
const linkActiveClasses = `${linkBaseClasses} text-coveGray after:bg-blueGrotto`;
const linkInactiveClasses = `${linkBaseClasses} text-indigoOcean after:bg-transparent hover:text-coveGray hover:after:bg-bluishWhite`;

function isActive(link: TNavLink) {
  if (route.path === "/") {
    return activeSection.value != null && link.href === `/#${activeSection.value}`;
  }

  return link.href === "/#services" && route.path.startsWith("/services/");
}

function linkClass(link: TNavLink) {
  return isActive(link) ? linkActiveClasses : linkInactiveClasses;
}
</script>

<template>
  <header class="kit-away sticky top-0 z-30 border-b border-bluishWhite transition-shadow duration-300" :class="{ 'shadow-float': isScrolled }">
    <BaseContainer>
      <div class="flex h-[3.75rem] items-center justify-between gap-6 desk:h-nav">
        <a href="/" class="flex shrink-0 items-center gap-3" data-qa="nav-crest">
          <img :src="LOGO_PATH" alt="Zcars" width="44" height="44" class="size-10 desk:size-11" />
          <span>
            <span class="block font-display text-[1.625rem] font-black uppercase leading-none">{{ brand }}</span>
            <span v-if="tagline" class="name-line mt-1 hidden text-indigoOcean xl:block">{{ tagline }}</span>
          </span>
        </a>
        <nav class="hidden h-full lg:block">
          <ul class="flex h-full">
            <li v-for="link in links" :key="link.href" class="h-full">
              <a :href="link.href" :class="linkClass(link)" :data-qa="`nav-link-${link.href.slice(2)}`">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
        <LayoutMainAction size="sm" class="hidden desk:inline-flex" />
        <BaseButton variant="navy" size="icon" :href="site.tel_href" class="desk:hidden" data-qa="nav-call">
          <PhPhone :size="20" class="shrink-0" />
        </BaseButton>
      </div>
    </BaseContainer>
  </header>
</template>
