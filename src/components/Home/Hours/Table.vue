<script setup lang="ts">
import { site } from "virtual:content";

import type { TWeekday } from "@/types";

defineOptions({ name: "HomeHoursTable" });

const openNow = useOpenNow();

const schedule = getWeekSchedule(site.hours);

const rowAttrs = (day: TWeekday): { "aria-current"?: "date" } => (day === openNow.today.value ? { "aria-current": "date" } : {});
</script>

<template>
  <div v-if="site.hours.length">
    <table class="w-full text-small">
      <caption class="sr-only">
        Opening hours
      </caption>
      <tbody class="divide-y divide-line">
        <tr v-for="row in schedule" :key="row.day" v-bind="rowAttrs(row.day)" :class="{ 'bg-surface font-semibold': row.day === openNow.today.value }">
          <th scope="row" class="h-11 px-3 py-3 text-left font-[inherit]">
            {{ WEEKDAY_NAMES[row.day] }}
            <span v-if="row.day === openNow.today.value" class="ml-2 text-micro uppercase tracking-eyebrow text-accent-text">Today</span>
          </th>
          <td class="px-3 py-3" :class="{ 'text-muted': row.label === 'Closed' }">{{ row.label }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="site.hours_note" class="mt-3 text-micro text-muted">{{ site.hours_note }}</p>
  </div>
</template>
