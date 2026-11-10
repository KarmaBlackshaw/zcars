<script setup lang="ts">
import { services, site } from "virtual:content";

import { LOGO_PATH } from "@/constants/brand";

defineOptions({ name: "LayoutFooter" });

const year = new Date().getFullYear();
const hoursSummary = getHoursSummary(site.hours);
const linkClass = "inline-flex min-h-11 items-center transition-colors hover:text-fg";
</script>

<template>
  <footer class="night overflow-hidden bg-night pb-[calc(4rem+env(safe-area-inset-bottom))] pt-12 text-small text-muted desk:pb-0">
    <BaseContainer>
      <div class="grid grid-cols-2 gap-x-6 gap-y-10 desk:grid-cols-4">
        <div class="col-span-2 desk:col-span-1">
          <span class="grid size-12 place-items-center rounded-lg bg-white">
            <img :src="LOGO_PATH" alt="" width="40" height="40" class="size-10" />
          </span>
          <strong class="mt-4 block font-display text-card-title uppercase italic text-fg">{{ site.name }}</strong>
          <address class="mt-2 not-italic">
            <BaseExternalLink :href="site.map_directions_url" class="text-muted hover:text-fg">{{ site.address }}</BaseExternalLink>
          </address>
        </div>
        <div>
          <h3 class="text-fg">Services</h3>
          <ul class="mt-2">
            <li v-for="service in services" :key="service.slug">
              <a :href="getServicePath(service.slug)" :class="linkClass">{{ service.title }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-fg">Visit</h3>
          <p v-if="hoursSummary" class="mt-2">{{ hoursSummary }}</p>
          <BaseExternalLink :href="site.map_directions_url" :class="linkClass">Get directions</BaseExternalLink>
        </div>
        <div>
          <h3 class="text-fg">Contact</h3>
          <ul class="mt-2">
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
        </div>
      </div>
      <p class="mt-10 border-t border-line pt-6">
        &copy; <span data-allow-mismatch="text">{{ year }}</span> {{ site.name }}
      </p>
      <p
        class="mt-6 translate-y-[18%] select-none whitespace-nowrap font-display text-wordmark uppercase italic text-fg [mask-image:linear-gradient(to_bottom,black_20%,transparent_95%)]"
      >
        {{ site.tagline }}
      </p>
    </BaseContainer>
  </footer>
</template>
