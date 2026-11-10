<script setup lang="ts">
import { site } from "virtual:content";
import { sectionClasses } from "@/constants/section";

defineOptions({ name: "SectionActions" });

const { quoteService } = defineProps<{ quoteService?: string }>();

const tileClass = "flex min-h-[15rem] flex-col justify-between";

const quoteDrawer = useQuoteDrawer();
const hoursSummary = getHoursSummary(site.hours);

function openQuote() {
  quoteDrawer.open(quoteService);
}
</script>

<template>
  <section :class="sectionClasses">
    <BaseContainer>
      <div class="reveal grid gap-3 md:grid-cols-2 desk:grid-cols-12 desk:gap-5">
        <BaseTile tone="accent" padding="lg" :class="[tileClass, 'md:col-span-2 desk:col-span-6']">
          <div>
            <h3 class="text-tile-title">Get a free quote</h3>
            <p class="mt-3 max-w-[34ch]">Send a photo of your car on Messenger. We reply with a price.</p>
          </div>
          <LayoutMainAction variant="light" class="self-start">Open Messenger</LayoutMainAction>
        </BaseTile>

        <BaseTile tone="night" padding="lg" :class="[tileClass, 'desk:col-span-3']">
          <div>
            <h3 class="text-tile-title">Call {{ site.phone_display }}</h3>
            <p v-if="hoursSummary" class="mt-3 text-small text-muted">{{ hoursSummary }}</p>
          </div>
          <BaseButton variant="light" :href="site.tel_href" class="self-start">Call the shop</BaseButton>
        </BaseTile>

        <BaseTile padding="lg" :class="[tileClass, 'desk:col-span-3']">
          <div>
            <h3 class="text-tile-title">Use the quote form</h3>
            <p class="mt-3 text-small text-muted">Add your car, the service and a photo. We will call or text your number.</p>
          </div>
          <BaseButton variant="dark" class="self-start" @click="openQuote">Open the quote form</BaseButton>
        </BaseTile>
      </div>
    </BaseContainer>
  </section>
</template>
