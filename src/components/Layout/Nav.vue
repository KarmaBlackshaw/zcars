<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

import { badgeClasses, LOGO_PATH } from "@/constants/brand";

defineOptions({ name: "LayoutNav" });

const links = useNavLinks();
const brandLabel = `${site.name}, home`;
const callLabel = `Call ${site.phone_display}`;

const linkClass =
  "relative font-medium text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-fg after:transition-transform after:duration-300 after:ease-settle hover:after:scale-x-100";
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-line bg-bg">
    <BaseContainer class="flex h-nav items-center justify-between gap-4">
      <a href="/" :aria-label="brandLabel" class="flex items-center gap-3">
        <img :src="LOGO_PATH" alt="" width="40" height="40" class="size-10 mix-blend-multiply" />
        <span :class="badgeClasses">ZCARS</span>
      </a>
      <nav aria-label="Primary" class="hidden desk:block">
        <ul class="flex gap-6">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" :class="linkClass">{{ link.label }}</a>
          </li>
        </ul>
      </nav>
      <div class="flex items-center gap-2">
        <BaseButton variant="text" size="icon" :href="site.tel_href" :aria-label="callLabel" class="min-[1100px]:hidden">
          <PhPhone aria-hidden="true" class="shrink-0" />
        </BaseButton>
        <BaseButton variant="text" size="sm" :href="site.tel_href" class="hidden min-[1100px]:inline-flex">
          <PhPhone aria-hidden="true" class="shrink-0" />
          Call {{ site.phone_display }}
        </BaseButton>
        <LayoutMainAction size="sm" class="hidden desk:inline-flex" />
      </div>
    </BaseContainer>
  </header>
</template>
