<script setup lang="ts">
import { services, site } from "virtual:content";

import { LOGO_PATH } from "@/constants/brand";

defineOptions({ name: "LayoutFooter" });

const year = new Date().getFullYear();
const hoursSummary = getHoursSummary(site.hours);
const linkClass = "inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white";
const headingClass = "name-line text-white";
</script>

<template>
  <footer class="kit-navy overflow-clip pb-[calc(4rem+env(safe-area-inset-bottom))] text-small text-blueCream desk:pb-0">
    <div class="rib"></div>
    <BaseContainer class="pt-14">
      <div class="grid grid-cols-2 gap-x-6 gap-y-10 desk:grid-cols-12">
        <div class="col-span-2 desk:col-span-4">
          <span class="stitch grid size-16 place-items-center rounded-md bg-white">
            <img :src="LOGO_PATH" alt="" width="52" height="52" class="size-[3.25rem]" />
          </span>
          <strong class="mt-5 block font-display text-h3 font-extrabold uppercase text-white">{{ site.name }}</strong>
          <address class="mt-2 max-w-[28ch] not-italic">{{ site.address }}</address>
        </div>
        <div class="desk:col-span-3">
          <p :class="headingClass">Services</p>
          <ul class="mt-3">
            <li v-for="service in services" :key="service.slug">
              <a :href="getServicePath(service.slug)" :class="linkClass" :data-qa="`footer-service-${service.slug}`">
                <span class="w-5 font-display text-base font-black tabular-nums text-white">{{ formatServiceNumber(service.position) }}</span>
                {{ service.title }}
              </a>
            </li>
          </ul>
        </div>
        <div class="desk:col-span-3">
          <p :class="headingClass">Visit</p>
          <p v-if="hoursSummary" class="mt-3 max-w-[30ch] text-balance">{{ hoursSummary }}</p>
          <a
            :href="site.map_directions_url"
            v-bind="getLinkAttrs(site.map_directions_url)"
            :class="[linkClass, 'underline underline-offset-4']"
            data-qa="footer-directions"
          >
            Get directions
          </a>
        </div>
        <div class="desk:col-span-2">
          <p :class="headingClass">Contact</p>
          <ul class="mt-3">
            <li>
              <a :href="site.tel_href" :class="linkClass" data-qa="footer-call">Call {{ site.phone_display }}</a>
            </li>
            <li>
              <a :href="site.messenger_url" v-bind="getLinkAttrs(site.messenger_url)" :class="linkClass" data-qa="footer-messenger">Messenger</a>
            </li>
            <li>
              <a :href="site.facebook_url" v-bind="getLinkAttrs(site.facebook_url)" :class="linkClass" data-qa="footer-facebook">Facebook</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-micro desk:flex-row desk:justify-between">
        <p>
          &copy; <span data-allow-mismatch="text">{{ year }}</span> {{ site.name }}
        </p>
        <p>Product names and logos are trademarks of their owners.</p>
      </div>
      <p
        class="mt-8 translate-y-[16%] select-none whitespace-nowrap font-display text-wordmark font-black uppercase text-white [mask-image:linear-gradient(to_bottom,black_30%,transparent_96%)] [text-shadow:.04em_.04em_0_rgb(var(--blueGrotto))]"
        data-qa="footer-wordmark"
      >
        {{ site.tagline }}
      </p>
    </BaseContainer>
  </footer>
</template>
