<script setup lang="ts">
import { PhFacebookLogo } from "@phosphor-icons/vue";
import logo from "@/assets/images/logo.webp";
import { BUSINESS_NAME, FACEBOOK_URL, NAV_LINKS } from "@/types";

defineOptions({ name: "LayoutFooter" });

const year = new Date().getFullYear();
</script>

<template>
  <footer class="overflow-hidden border-t border-line pt-14 text-small text-muted">
    <BaseContainer>
      <div class="flex flex-wrap items-center justify-between gap-8">
        <div class="flex items-center gap-3">
          <img :src="logo" alt="" width="40" height="40" class="size-10 rounded-full" />
          <div class="leading-tight">
            <strong class="block font-semibold text-fg">{{ BUSINESS_NAME }}</strong>
            Alagang Zcars!
          </div>
        </div>
        <nav aria-label="Footer">
          <ul role="list" class="flex flex-wrap items-center gap-x-8 gap-y-2">
            <li v-for="link in NAV_LINKS" :key="link.href">
              <a :href="link.href" class="transition-colors hover:text-fg">{{ link.label }}</a>
            </li>
            <li>
              <a :href="FACEBOOK_URL" target="_blank" rel="noopener" class="inline-flex min-h-6 items-center gap-[.4rem] py-1 transition-colors hover:text-fg">
                <PhFacebookLogo aria-hidden="true" class="shrink-0" />Facebook<span class="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p class="mt-10 border-t border-line pt-6">
        &copy; <span data-allow-mismatch="text">{{ year }}</span> {{ BUSINESS_NAME }}
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
