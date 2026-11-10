<script setup lang="ts">
import { hiringRoles, home, site } from "virtual:content";
import PhMessengerLogo from "~icons/ph/messenger-logo";

defineOptions({ name: "HomeTeamHiring" });
</script>

<template>
  <div v-if="hiringRoles.length" class="mt-10">
    <h3>Open roles at Zcars</h3>
    <ul class="mt-4 flex flex-wrap gap-2">
      <li v-for="role in hiringRoles" :key="role.id">
        <BaseChip>{{ role.name }}, {{ role.level }}</BaseChip>
      </li>
    </ul>
    <p v-if="home.hiring_text" class="mt-4 text-muted">{{ home.hiring_text }}</p>
    <BaseButton variant="dark" :href="site.messenger_url" class="mt-6">
      <PhMessengerLogo class="shrink-0" />
      Apply on Messenger
    </BaseButton>
  </div>
</template>
