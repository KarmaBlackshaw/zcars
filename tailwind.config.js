const settle = "cubic-bezier(.16,1,.3,1)";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--accent-hover) / <alpha-value>)",
        link: "rgb(var(--link) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        night: "rgb(var(--windsorBlue) / <alpha-value>)",
      },
      spacing: { nav: "88px" },
      scrollMargin: { nav: "96px" },
      fontFamily: {
        sans: ["Archivo Variable", "system-ui", "sans-serif"],
      },
      screens: { desk: "900px" },
      fontSize: {
        display: ["clamp(2.5rem, 5.6vw, 5.25rem)", { lineHeight: ".98", letterSpacing: "-0.035em", fontWeight: "760" }],
        h2: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "740" }],
        list: ["clamp(1.75rem, 3.4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
        price: ["clamp(4.5rem, 11vw, 10rem)", { lineHeight: ".9", letterSpacing: "-0.04em", fontWeight: "800" }],
        "tile-price": ["clamp(2.75rem, 4.4vw, 4rem)", { lineHeight: ".95", letterSpacing: "-0.035em", fontWeight: "800" }],
        h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "650" }],
        lead: ["clamp(1.0625rem, 1.3vw, 1.25rem)", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        small: [".9375rem", { lineHeight: "1.5" }],
        micro: [".8125rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      boxShadow: {
        tile: "var(--shadow-tile)",
        lift: "var(--shadow-lift)",
      },
      opacity: { 72: ".72", 88: ".88" },
      transitionTimingFunction: { settle },
      maxWidth: { page: "1440px", photo: "540px" },
      keyframes: {
        "drawer-in": { from: { transform: "translateX(100%)" } },
        enter: { from: { transform: "translateY(20px)" } },
        rise: { from: { transform: "translateY(32px)" } },
      },
      animation: {
        "drawer-in": `drawer-in .4s ${settle}`,
        enter: `enter .7s ${settle} var(--delay, 0s) backwards`,
        rise: `rise .8s ${settle} var(--delay, 0s) backwards`,
      },
    },
  },
  plugins: [],
};
