<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { hiringRoles, home, site } from "virtual:content";

defineOptions({ name: "HomeTeamHiring" });
</script>

<template>
  <div v-if="hiringRoles.length" class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
    <span class="inline-flex items-center gap-2 font-semibold">
      <span class="size-2 rounded-full bg-success"></span>
      We're hiring
    </span>
    <ul role="list" class="flex flex-wrap gap-2">
      <li v-for="role in hiringRoles" :key="role.id" class="rounded-full border border-line px-3 py-1 text-small">
        {{ role.name }} <span class="text-muted">· {{ role.level }}</span>
      </li>
    </ul>
    <BaseExternalLink :href="site.messenger_url" class="inline-flex min-h-11 items-center gap-1.5 text-small font-semibold text-accent-text hover:underline">
      <PhMessengerLogo class="shrink-0" />
      {{ home.hiring_text ?? "Message us to apply" }}
    </BaseExternalLink>
  </div>
</template>
