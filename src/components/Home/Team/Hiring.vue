<script setup lang="ts">
import { PhMessengerLogo } from "@phosphor-icons/vue";
import { hiringRoles, home, site } from "virtual:content";

defineOptions({ name: "HomeTeamHiring" });
</script>

<template>
  <div v-if="hiringRoles.length" class="mt-12" data-qa="hiring">
    <h3>Open roles at Zcars</h3>
    <ul class="mt-4 border-t border-line">
      <li
        v-for="role in hiringRoles"
        :key="role.id"
        class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-4"
        :data-qa="`hiring-role-${role.id}`"
      >
        <span class="font-display text-h3 font-extrabold uppercase">{{ role.name }}</span>
        <span class="name-line text-muted">{{ role.level }}</span>
      </li>
    </ul>
    <p v-if="home.hiring_text" class="mt-5 text-muted">{{ home.hiring_text }}</p>
    <BaseButton :href="site.messenger_url" class="mt-6" data-qa="hiring-apply">
      <PhMessengerLogo :size="20" class="shrink-0" />
      Apply on Messenger
    </BaseButton>
  </div>
</template>
