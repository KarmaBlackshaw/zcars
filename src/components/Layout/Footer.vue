<script setup lang="ts">
import { PhFacebookLogo, PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";
import logo from "@/assets/images/logo.webp";

defineOptions({ name: "LayoutFooter" });

const links = useNavLinks();
const year = new Date().getFullYear();
const hoursLines = site.hours.map((entry) => `${entry.days.join(", ")}: ${formatTimeRange(entry.opens, entry.closes)}`);
const linkClass = "inline-flex min-h-11 items-center gap-[.4rem] transition-colors hover:text-fg";
</script>

<template>
  <footer class="overflow-hidden border-t border-line pb-[calc(5rem+env(safe-area-inset-bottom))] pt-14 text-small text-muted desk:pb-0">
    <BaseContainer>
      <div class="grid gap-8 desk:grid-cols-3">
        <div class="flex items-start gap-3">
          <img :src="logo" alt="" width="40" height="40" class="size-10 rounded-full" />
          <div class="leading-tight">
            <strong class="block font-semibold text-fg">{{ site.name }}</strong>
            {{ site.tagline }}
          </div>
        </div>
        <div>
          <ul role="list">
            <li>
              <a :href="site.tel_href" :class="linkClass"> <PhPhone aria-hidden="true" class="shrink-0" />Call {{ site.phone_display }} </a>
            </li>
            <li>
              <BaseExternalLink :href="site.messenger_url" :class="linkClass">
                <PhMessengerLogo aria-hidden="true" class="shrink-0" />Message
              </BaseExternalLink>
            </li>
            <li>
              <BaseExternalLink :href="site.facebook_url" :class="linkClass"> <PhFacebookLogo aria-hidden="true" class="shrink-0" />Facebook </BaseExternalLink>
            </li>
          </ul>
          <address class="mt-2 not-italic">{{ site.address }}</address>
        </div>
        <div v-if="site.hours.length">
          <ul role="list" class="space-y-1">
            <li v-for="line in hoursLines" :key="line">{{ line }}</li>
          </ul>
          <p v-if="site.hours_note" class="mt-2">{{ site.hours_note }}</p>
        </div>
      </div>
      <nav aria-label="Footer" class="mt-8">
        <ul role="list" class="flex flex-wrap items-center gap-x-8">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" :class="linkClass">{{ link.label }}</a>
          </li>
        </ul>
      </nav>
      <p class="mt-10 border-t border-line pt-6">
        &copy; <span data-allow-mismatch="text">{{ year }}</span> {{ site.name }}
      </p>
      <p
        aria-hidden="true"
        class="mt-6 translate-y-[18%] select-none text-[clamp(4.5rem,17vw,15rem)] font-extrabold leading-[.8] tracking-[-0.04em] text-line [font-stretch:125%]"
      >
        Zcars
      </p>
    </BaseContainer>
  </footer>
</template>
