export const stagger = (index: number, cap = 3) => revealFade(Math.min(index, cap) * 0.09);
