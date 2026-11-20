<script setup lang="ts">
import { site } from "virtual:content";

import type { TWeekday } from "@/types";

defineOptions({ name: "SectionVisitHoursTable" });

const openNow = useOpenNow();

const schedule = getWeekSchedule(site.hours);

function isToday(day: TWeekday) {
  return day === openNow.today.value;
}

function rowClass(day: TWeekday) {
  return isToday(day) ? "font-bold" : "";
}
</script>

<template>
  <div v-if="site.hours.length">
    <table class="w-full text-small tabular-nums">
      <tbody class="divide-y divide-line">
        <tr v-for="row in schedule" :key="row.day" :class="rowClass(row.day)" :data-qa="`hours-row-${row.day}`">
          <th scope="row" class="h-11 py-2.5 pr-3 text-left font-[inherit]">
            {{ WEEKDAY_NAMES[row.day] }}
            <span v-if="isToday(row.day)" class="name-line ml-2">Today</span>
          </th>
          <td class="py-2.5 text-right">
            <BasePatch v-if="row.label === 'Closed'" tone="outline" class="-rotate-3">Closed</BasePatch>
            <template v-else>{{ row.label }}</template>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="site.hours_note" class="mt-3 text-small">{{ site.hours_note }}</p>
  </div>
</template>
