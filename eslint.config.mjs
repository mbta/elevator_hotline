import globals from "globals";
import jsPlugin from "@eslint/js";
import tsPlugin from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";

export default [
  { languageOptions: { globals: globals.node } },
  jsPlugin.configs.recommended,
  ...tsPlugin.configs.recommended,
  prettierConfig,
  {
    files: ["test/**"],
    ...jestPlugin.configs["flat/style"],
  },
];
