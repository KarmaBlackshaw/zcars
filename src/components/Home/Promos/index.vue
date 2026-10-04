<script setup lang="ts">
import { home } from "virtual:content";

defineOptions({ name: "HomePromos" });

const STAGGER_CAP = 3;

const copy = home.promos;
const { activePromos } = usePromos();

const featured = computed(() => activePromos.value[0]);
const others = computed(() => activePromos.value.slice(1));

function revealAt(index: number) {
  return revealFade(Math.min(index + 1, STAGGER_CAP) * 0.09);
}
</script>

<template>
  <section v-if="featured" id="promos" aria-labelledby="promos-title" class="scroll-mt-nav py-24 desk:py-32">
    <BaseContainer>
      <BaseSectionHeading id="promos-title" v-motion="reveal()" :title="copy.title" :lead="copy.lead" />
      <div v-motion="revealFade(0)" class="mt-12">
        <HomePromosCard :promo="featured" is-featured />
      </div>
      <ul v-if="others.length" role="list" class="mt-4 grid gap-4 sm:grid-cols-2 desk:grid-cols-3">
        <li v-for="(promo, index) in others" :key="promo.title" v-motion="revealAt(index)">
          <HomePromosCard :promo="promo" />
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>
