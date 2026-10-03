<script setup lang="ts">
import { PhFacebookLogo } from "@phosphor-icons/vue";
import { FACEBOOK_URL } from "@/types";

defineOptions({ name: "HomeTeamHiring" });

const roles = ["Car painter", "Car detailer"];
</script>

<template>
  <div v-motion="reveal(0.12)" class="mt-12">
    <h3 class="flex items-center gap-3">
      <span aria-hidden="true" class="relative flex size-2.5">
        <span class="absolute inline-flex size-full rounded-full bg-accent-text opacity-60 motion-safe:animate-ping"></span>
        <span class="relative inline-flex size-2.5 rounded-full bg-accent-text"></span>
      </span>
      We're hiring
    </h3>
    <ul role="list" class="mt-5 divide-y divide-line border-y border-line">
      <li v-for="role in roles" :key="role" class="flex items-center justify-between gap-4 py-4">
        <span class="font-semibold">{{ role }}</span>
        <span class="text-small text-muted">Experienced</span>
      </li>
    </ul>
    <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p class="text-muted">Send us a message on Facebook.</p>
      <BaseButton variant="ghost" size="sm" :href="FACEBOOK_URL" target="_blank" rel="noopener">
        <PhFacebookLogo aria-hidden="true" class="shrink-0" />Message us<span class="sr-only"> (opens in new tab)</span>
      </BaseButton>
    </div>
  </div>
</template>
