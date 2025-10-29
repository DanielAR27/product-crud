import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,  // Agregar globales de Node.js
      }
    },
    rules: {
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",  // Ignorar variables que empiecen con _
        "varsIgnorePattern": "^_"
      }]
    }
  },
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "**/*.test.js"
    ]
  }
];