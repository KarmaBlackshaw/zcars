<script setup lang="ts">
defineOptions({ name: "SectionHero" });

const { heading, lead, quoteService } = defineProps<{ heading: string; lead: string; quoteService?: string }>();

defineSlots<{ top?(): unknown; facts?(): unknown; bento?(): unknown }>();

const quoteDrawer = useQuoteDrawer();

function openQuote() {
  quoteDrawer.open(quoteService);
}
</script>

<template>
  <section class="night bg-night pb-12 pt-24 desk:pb-16 desk:pt-[7.5rem]">
    <BaseContainer>
      <div class="[--delay:0ms] motion-safe:animate-enter">
        <slot name="top"></slot>
        <h1>{{ heading }}</h1>
      </div>
      <div class="mt-6 desk:mt-8 min-[1140px]:grid min-[1140px]:grid-cols-12 min-[1140px]:items-end min-[1140px]:gap-4">
        <div class="[--delay:60ms] motion-safe:animate-enter min-[1140px]:col-span-5">
          <p class="max-w-[46ch] text-lead text-muted">{{ lead }}</p>
          <div v-if="$slots.facts" class="mt-5 min-h-[2.8125rem] text-small font-semibold desk:min-h-0">
            <slot name="facts"></slot>
          </div>
        </div>
        <div
          class="mt-6 flex flex-wrap justify-between gap-3 [--delay:120ms] motion-safe:animate-enter desk:mt-8 desk:justify-start min-[1140px]:col-span-7 min-[1140px]:mt-0 min-[1140px]:justify-end min-[1140px]:justify-self-end"
        >
          <LayoutMainAction class="w-full desk:w-auto" />
          <LayoutCallAction class="desk:w-auto" />
          <BaseButton variant="text" class="min-[1140px]:basis-full min-[1140px]:justify-end" @click="openQuote"> Or use the quote form </BaseButton>
        </div>
      </div>
      <div v-if="$slots.bento" class="mt-10 desk:mt-12">
        <slot name="bento"></slot>
      </div>
    </BaseContainer>
  </section>
</template>
