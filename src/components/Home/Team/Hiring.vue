<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { hiringRoles, home, site } from "virtual:content";

defineOptions({ name: "HomeTeamHiring" });
</script>

<template>
  <div v-if="hiringRoles.length" class="mt-10">
    <h3>Open roles at Zcars</h3>
    <ul class="mt-3 border-t border-line">
      <li v-for="role in hiringRoles" :key="role.id" class="border-b border-line py-3">{{ role.name }}, {{ role.level }}</li>
    </ul>
    <p v-if="home.hiring_text" class="mt-4 text-muted">{{ home.hiring_text }}</p>
    <BaseButton variant="text" :href="site.messenger_url">
      <PhMessengerLogo class="shrink-0" />
      Apply on Messenger
    </BaseButton>
  </div>
</template>
