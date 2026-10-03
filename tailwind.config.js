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
        brilliantBlue: "#1d4ed8",
        bunker: "#0f1218",
        sportyWhite: "#eef1f6",
        ghost: "#c3cad6",
        inkBlack: "#080a0e",
      },
      spacing: { nav: "68px" },
      borderRadius: { card: "14px" },
      fontFamily: { sans: ["Archivo Variable", "Archivo", "system-ui", "sans-serif"] },
      screens: { desk: "900px" },
      fontSize: {
        h1: ["clamp(2.5rem, 5.4vw, 4.75rem)", { lineHeight: ".98" }],
        h2: ["clamp(2rem, 3.8vw, 3.25rem)", { lineHeight: "1.02" }],
        h3: ["1.25rem", { lineHeight: "1.2" }],
        lead: "1.0625rem",
        small: ".9375rem",
        micro: ".8125rem",
      },
      letterSpacing: { heading: "-0.02em", eyebrow: ".14em" },
      transitionTimingFunction: { settle },
      transitionDuration: { 800: "800ms" },
    },
  },
  plugins: [],
};
