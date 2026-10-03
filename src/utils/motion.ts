const settle = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const;
const hidden = { opacity: 0, y: 24 };
const shown = { opacity: 1, y: 0 };

export const enter = (delay = 0) => ({ initial: hidden, animate: shown, transition: { ...settle, delay } });

export const reveal = (delay = 0) => ({ initial: hidden, whileInView: shown, inViewOptions: { once: true, amount: 0.15 }, transition: { ...settle, delay } });
