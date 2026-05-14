import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";

export default [
  js.configs.recommended,
  jestPlugin.configs["flat/recommended"],
  {
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...jestPlugin.environments.globals.globals,
      }
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-conditional-expect": "error",
      "jest/no-identical-title": "error"
    }
  }
];
