const settle = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const;
const hidden = { opacity: 0, y: 24 };
const shown = { opacity: 1, y: 0 };

export const enter = (delay = 0) => ({ initial: hidden, animate: shown, transition: { ...settle, delay } });

export const reveal = (delay = 0) => ({ initial: hidden, whileInView: shown, inViewOptions: { once: true, amount: 0.15 }, transition: { ...settle, delay } });

export const revealFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  inViewOptions: { once: true, amount: 0.15 },
  transition: { ...settle, delay },
});

export const stagger = (index: number, cap = 3) => reveal(Math.min(index, cap) * 0.09);
