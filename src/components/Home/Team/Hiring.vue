<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";

defineOptions({ name: "HomeTeamHiring" });
</script>

<template>
  <div v-if="home.hiring.is_hiring" v-motion="reveal(0.12)" class="mt-12">
    <h3 class="flex items-center gap-3">
      <span aria-hidden="true" class="relative flex size-2.5">
        <span class="absolute inline-flex size-full rounded-full bg-accent-text opacity-60 motion-safe:animate-ping"></span>
        <span class="relative inline-flex size-2.5 rounded-full bg-accent-text"></span>
      </span>
      We're hiring
    </h3>
    <ul role="list" class="mt-5 divide-y divide-line border-y border-line">
      <li v-for="role in home.hiring.roles" :key="role.name" class="flex items-center justify-between gap-4 py-4">
        <span class="font-semibold">{{ role.name }}</span>
        <span class="text-small text-muted">{{ role.level }}</span>
      </li>
    </ul>
    <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p class="text-muted">{{ home.hiring.text }}</p>
      <BaseButton variant="ghost" size="sm" :href="site.messenger_url"> <PhMessengerLogo aria-hidden="true" class="shrink-0" />Message us to apply </BaseButton>
    </div>
  </div>
</template>
