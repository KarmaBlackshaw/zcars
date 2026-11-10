<script setup lang="ts">
import { site } from "virtual:content";

import { WEEKDAY_NAMES } from "@/constants/hours";

import type { TWeekday } from "@/types";

defineOptions({ name: "SectionVisitHoursTable" });

const openNow = useOpenNow();

const schedule = getWeekSchedule(site.hours);

function isToday(day: TWeekday) {
  return day === openNow.today.value;
}

function rowClass(day: TWeekday) {
  return isToday(day) ? "font-semibold" : "";
}

function labelClass(isClosed: boolean) {
  return isClosed ? "text-muted" : "";
}
</script>

<template>
  <div v-if="site.hours.length">
    <table class="w-full text-small">
      <tbody class="divide-y divide-line">
        <tr v-for="row in schedule" :key="row.day" :class="rowClass(row.day)">
          <th scope="row" class="h-11 px-3 py-3 text-left font-[inherit]">
            {{ WEEKDAY_NAMES[row.day] }}
            <span v-if="isToday(row.day)" class="ml-2 text-micro text-muted">Today</span>
          </th>
          <td class="px-3 py-3" :class="labelClass(row.isClosed)">{{ row.label }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="site.hours_note" class="mt-3 text-micro text-muted">{{ site.hours_note }}</p>
  </div>
</template>
