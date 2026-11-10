import "@fontsource-variable/archivo";
import "@/assets/style.scss";
import { ViteSSG } from "vite-ssg";
import { routes, handleHotUpdate } from "vue-router/auto-routes";

import App from "./App.vue";

export const createApp = ViteSSG(
  App,
  { routes },
  ({ router }) => {
    if (import.meta.hot) {
      handleHotUpdate(router);
    }
  },
  { hydration: import.meta.env.PROD, useHead: false }
);
