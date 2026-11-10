import "@fontsource/saira/900-italic.css";
import "@fontsource/saira/latin-700-italic.css";
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-600.css";
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
