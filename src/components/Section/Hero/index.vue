<script setup lang="ts">
import { PhPhone } from "@phosphor-icons/vue";
import { site } from "virtual:content";

defineOptions({ name: "SectionHero" });

const { heading, lead, quoteService } = defineProps<{ heading: string; lead: string; quoteService?: string }>();

defineSlots<{ top?(): unknown; facts?(): unknown; picture?(): unknown }>();

const slots = useSlots();
const quoteDrawer = useQuoteDrawer();

function hasPicture() {
  return slots.picture != null;
}

function textColumnClass() {
  return hasPicture() ? "desk:col-span-7" : "desk:col-span-9";
}

function openQuote() {
  quoteDrawer.open(quoteService);
}
</script>

<template>
  <section>
    <BaseContainer class="grid grid-cols-1 gap-y-4 pb-12 pt-4 desk:grid-cols-12 desk:items-end desk:gap-x-12 desk:pb-20 desk:pt-8">
      <div v-if="hasPicture()" class="order-first max-desk:max-w-photo desk:order-last desk:col-span-5">
        <slot name="picture"></slot>
      </div>
      <div :class="textColumnClass()">
        <div class="motion-safe:animate-enter">
          <slot name="top"></slot>
          <h1 class="text-balance">{{ heading }}</h1>
        </div>
        <p class="mt-5 max-w-[44ch] text-lead text-muted [--delay:60ms] motion-safe:animate-enter">{{ lead }}</p>
        <div class="[--delay:120ms] motion-safe:animate-enter">
          <div class="mt-6 min-h-[3rem] font-semibold desk:min-h-0"><slot name="facts"></slot></div>
          <div id="hero-actions" class="mt-6 grid gap-4 desk:flex desk:flex-wrap desk:items-center desk:gap-x-6">
            <LayoutMainAction class="w-full desk:w-auto" />
            <div class="flex flex-wrap items-center gap-x-6 desk:contents">
              <BaseButton variant="text" :href="site.tel_href">
                <PhPhone class="shrink-0" />
                <span class="desk:hidden">Call</span>
                <span class="hidden desk:inline">Call {{ site.phone_display }}</span>
              </BaseButton>
              <BaseButton variant="text" @click="openQuote">Or use the quote form</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
