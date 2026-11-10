<script setup lang="ts">
import { site } from "virtual:content";
import { sectionClasses } from "@/constants/section";

defineOptions({ name: "HomePromos" });

const { activePromos } = usePromos();

const featured = computed(() => activePromos.value[0]);
const others = computed(() => activePromos.value.slice(1));
const validity = computed(() => formatPromoValidity(featured.value?.starts_on, featured.value?.ends_on));
</script>

<template>
  <section v-if="featured" id="promo" class="bg-brand text-bg" :class="sectionClasses">
    <BaseContainer>
      <div v-motion="revealFade()" class="grid gap-6 desk:grid-cols-12 desk:items-end desk:gap-8">
        <p v-if="featured.price_label" class="font-display text-price tabular-nums text-brand-highlight [font-stretch:140%] desk:col-span-6">
          {{ featured.price_label }}
        </p>
        <div class="desk:col-span-6">
          <h2>{{ featured.title }}</h2>
          <p class="mt-4 max-w-[52ch] text-lead">{{ featured.text }}</p>
          <p v-if="validity" class="mt-3 text-micro font-semibold">{{ validity }}</p>
          <BaseButton variant="onBrand" :href="site.messenger_url" class="mt-8 w-full desk:w-auto">Book this promo</BaseButton>
        </div>
      </div>
      <ul v-if="others.length" class="mt-12 divide-y divide-brand-highlight/30 border-t border-brand-highlight/30">
        <li v-for="(promo, index) in others" :key="promo.id" v-motion="stagger(index)">
          <HomePromosCard :promo="promo" />
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
