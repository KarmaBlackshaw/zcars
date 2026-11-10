<script setup lang="ts">
import { site } from "virtual:content";

import type { TWeekday } from "@/types";

defineOptions({ name: "SectionHeroVisitTile" });

type THoursRun = {
  first: TWeekday;
  last: TWeekday;
  label: string;
};

const runs = getWeekSchedule(site.hours).reduce<THoursRun[]>((groups, { day, label }) => {
  const run = groups.at(-1);

  if (run?.label === label) {
    run.last = day;
  } else {
    groups.push({ first: day, last: day, label });
  }

  return groups;
}, []);

const hoursSummary = runs
  .filter(({ label }) => label !== "Closed")
  .map(({ first, last, label }) => (first === last ? `${WEEKDAY_NAMES[first]}, ${label}` : `${WEEKDAY_NAMES[first]} to ${WEEKDAY_NAMES[last]}, ${label}`))
  .join("; ");
</script>

<template>
  <BaseTile padding="md">
    <div class="flex h-full flex-col justify-between gap-4">
      <div>
        <h3>{{ site.locality }}</h3>
        <p v-if="hoursSummary" class="mt-2 text-small text-muted">{{ hoursSummary }}</p>
      </div>
      <BaseButton variant="text" class="self-start" :href="site.map_directions_url">Get directions</BaseButton>
    </div>
  </BaseTile>
</template>
