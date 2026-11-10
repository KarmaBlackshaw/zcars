import { settle } from "@/constants/motion";

export const revealFade = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  inViewOptions: { once: true, amount: 0.15 },
  transition: { ...settle, delay },
});
