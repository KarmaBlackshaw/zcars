import { builtOn, promos, services } from "virtual:content";

const today = ref(builtOn);

export function usePromos() {
  onMounted(() => {
    today.value = getTodayInManila();
  });

  const activePromos = computed(() =>
    promos
      .filter((promo) => (promo.starts_on == null || promo.starts_on <= today.value) && (promo.ends_on == null || promo.ends_on >= today.value))
      .map((promo) => ({ ...promo, serviceTitle: services.find((service) => service.slug === promo.service)?.title }))
  );

  return { activePromos };
}
