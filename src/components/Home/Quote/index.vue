<script setup lang="ts">
import { PhMessengerLogo, PhPhone } from "@phosphor-icons/vue";
import { home, site } from "virtual:content";

defineOptions({ name: "HomeQuote" });

const copy = home.quote;
</script>

<template>
  <section id="quote" aria-labelledby="quote-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer class="grid gap-10 desk:grid-cols-12 desk:gap-8">
      <div class="desk:col-span-7">
        <BaseSectionHeading id="quote-title" :title="copy.title" :eyebrow="copy.eyebrow" :lead="copy.lead" />
        <div class="mt-8 rounded-card bg-surface p-5 desk:p-8">
          <HomeQuoteForm />
        </div>
      </div>
      <div class="grid content-start justify-items-start gap-5 desk:sticky desk:top-[calc(theme(spacing.nav)+1.5rem)] desk:col-span-5 desk:self-start">
        <h3>Prefer to talk?</h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton :href="site.tel_href">
            <PhPhone aria-hidden="true" class="shrink-0" />
            Call {{ site.phone_display }}
          </BaseButton>
          <BaseButton variant="ghost" :href="site.messenger_url">
            <PhMessengerLogo aria-hidden="true" class="shrink-0" />
            Message
          </BaseButton>
        </div>
        <p class="text-muted">{{ site.address }}</p>
        <p v-if="copy.reply_time" class="text-small text-muted">{{ copy.reply_time }}</p>
      </div>
    </BaseContainer>
  </section>
</template>
