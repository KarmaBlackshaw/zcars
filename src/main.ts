import "@fontsource-variable/archivo/wdth.css";
import "@/assets/style.scss";
import { MotionPlugin } from "motion-v";
import { ViteSSG } from "vite-ssg";
import { routes, handleHotUpdate } from "vue-router/auto-routes";

import App from "./App.vue";

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router }) => {
    app.use(MotionPlugin);

    if (import.meta.hot) {
      handleHotUpdate(router);
    }
  },
  { hydration: import.meta.env.PROD, useHead: false }
);
