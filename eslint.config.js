import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const autoImports = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./auto-import.json"), "utf-8"));

const languageGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.es2021,
  ...autoImports.globals,
  definePage: "readonly",
};

const settings = {
  "import/resolver": {
    typescript: { alwaysTryTypes: true, project: "./tsconfig.app.json" },
    node: true,
  },
};

const rules = {
  curly: "error",
  eqeqeq: "off",
  "lines-between-class-members": ["error", "always"],
  "no-console": ["warn", { allow: ["warn", "error", "info"] }],
  "no-debugger": "warn",
  "no-extra-boolean-cast": "off",
  "no-else-return": "error",
  "prefer-const": "error",
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "no-redeclare": "off",
  "@typescript-eslint/no-redeclare": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
      args: "after-used",
      ignoreRestSiblings: true,
    },
  ],
  "padding-line-between-statements": [
    "error",
    { blankLine: "always", prev: "*", next: "multiline-const" },
    { blankLine: "always", prev: "*", next: "return" },
    { blankLine: "always", prev: "const", next: "export" },
    { blankLine: "always", prev: "multiline-block-like", next: "export" },
    { blankLine: "always", prev: "*", next: "multiline-expression" },
    { blankLine: "always", prev: "*", next: "if" },
    { blankLine: "always", prev: "multiline-expression", next: "*" },
    { blankLine: "always", prev: "if", next: "*" },
  ],
  "vue/multi-word-component-names": "off",
  "vue/html-self-closing": [
    "error",
    {
      html: { void: "always", normal: "never", component: "always" },
      svg: "always",
      math: "always",
    },
  ],
  "vue/attribute-hyphenation": ["error", "always", { ignore: [], ignoreTags: [] }],
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
      "newlines-between": "ignore",
    },
  ],
};

export default [
  {
    ignores: [
      "**/dist/**",
      "**/dist-ssr/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.husky/**",
      "**/auto-imports.d.ts",
      "**/components.d.ts",
      "**/typed-router.d.ts",
      "auto-import.json",
      "postcss.config.js",
      "tailwind.config.js",
      "src/{types,composables,utils}/index.ts",
      "docs/**",
      ".gstack/**",
      ".claude/**",
      "**/.vite-ssg-temp/**",
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: languageGlobals,
    },
    plugins: { "@typescript-eslint": tsPlugin, "unused-imports": unusedImports },
    settings,
    rules,
  },
  {
    files: ["**/*.{ts,tsx,mts,cts,js,mjs,cjs}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: languageGlobals,
    },
    plugins: { "@typescript-eslint": tsPlugin, "unused-imports": unusedImports },
    settings,
    rules,
  },
];
