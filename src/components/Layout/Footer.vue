<script setup lang="ts">
import { site } from "virtual:content";

import { LOGO_PATH } from "@/constants/brand";

defineOptions({ name: "LayoutFooter" });

const links = useNavLinks();
const year = new Date().getFullYear();
const linkClass = "inline-flex min-h-11 items-center transition-colors hover:text-fg";
</script>

<template>
  <footer class="overflow-hidden border-t border-line pb-[calc(5rem+env(safe-area-inset-bottom))] pt-12 text-small text-muted desk:pb-0">
    <BaseContainer>
      <div class="grid gap-8 desk:grid-cols-3">
        <div class="flex items-start gap-3">
          <img :src="LOGO_PATH" alt="" width="40" height="40" class="size-10 mix-blend-multiply" />
          <div class="leading-tight">
            <strong class="block font-semibold text-fg">{{ site.name }}</strong>
            {{ site.tagline }}
            <address class="mt-2 not-italic">
              <BaseExternalLink :href="site.map_directions_url" :class="linkClass">{{ site.address }}</BaseExternalLink>
            </address>
          </div>
        </div>
        <ul role="list">
          <li>
            <a :href="site.tel_href" :class="linkClass">Call {{ site.phone_display }}</a>
          </li>
          <li>
            <BaseExternalLink :href="site.messenger_url" :class="linkClass">Messenger</BaseExternalLink>
          </li>
          <li>
            <BaseExternalLink :href="site.facebook_url" :class="linkClass">Facebook</BaseExternalLink>
          </li>
        </ul>
        <nav aria-label="Footer">
          <ul role="list">
            <li v-for="link in links" :key="link.href">
              <a :href="link.href" :class="linkClass">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <p class="mt-10 border-t border-line pt-6">
        &copy; <span data-allow-mismatch="text">{{ year }}</span> {{ site.name }}
      </p>
      <p
        class="mt-6 translate-y-[18%] select-none font-display text-[clamp(4rem,12vw,12rem)] font-extrabold leading-[.8] tracking-[-0.04em] text-line [font-stretch:150%]"
      >
        Zcars
      </p>
    </BaseContainer>
  </footer>
</template>
