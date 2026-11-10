const settle = "cubic-bezier(.16,1,.3,1)";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-text": "rgb(var(--accent-text) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        "brand-highlight": "rgb(var(--brand-highlight) / <alpha-value>)",
      },
      spacing: { nav: "68px" },
      scrollMargin: { nav: "72px" },
      fontFamily: {
        display: ["Anybody Variable", "Archivo Variable", "system-ui", "sans-serif"],
        sans: ["Archivo Variable", "system-ui", "sans-serif"],
      },
      screens: { desk: "900px" },
      fontSize: {
        price: ["clamp(4rem, 7.5vw, 7rem)", { lineHeight: ".9", letterSpacing: "-0.01em", fontWeight: "850" }],
        h1: ["clamp(1.75rem, 4.2vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        h2: ["clamp(1.75rem, 2.9vw, 2.5rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        h3: ["1.125rem", { lineHeight: "1.35" }],
        badge: [".8125rem", { lineHeight: "1", letterSpacing: ".14em", fontWeight: "800" }],
        lead: ["1.125rem", { lineHeight: "1.55" }],
        small: [".9375rem", { lineHeight: "1.5" }],
        micro: [".8125rem", { lineHeight: "1.4" }],
      },
      transitionTimingFunction: { settle },
      transitionDuration: { 800: "800ms" },
      maxWidth: { photo: "540px" },
      keyframes: {
        "drawer-in": { from: { transform: "translateX(100%)" } },
        enter: { from: { transform: "translateY(24px)" } },
      },
      animation: {
        "drawer-in": `drawer-in .4s ${settle}`,
        enter: `enter .8s ${settle} var(--delay, 0s) backwards`,
      },
    },
  },
  plugins: [],
};
