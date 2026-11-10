<script setup lang="ts">
import type { TService } from "@/types";

defineOptions({ name: "ServiceList" });

const { services } = defineProps<{ services: TService[] }>();

const shouldLoadThumbnail = ref(false);

function onPointerenter(event: PointerEvent) {
  if (event.pointerType === "mouse") {
    shouldLoadThumbnail.value = true;
  }
}
</script>

<template>
  <ul class="border-t border-fg/10" @pointerenter="onPointerenter">
    <ServiceListRow v-for="service in services" :key="service.slug" :service="service" :should-load-thumbnail="shouldLoadThumbnail" />
  </ul>
</template>
