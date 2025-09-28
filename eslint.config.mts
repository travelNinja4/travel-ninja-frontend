import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.next/**'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },

  ...tseslint.configs.recommended,
  ...pluginReact.configs.flat.recommended,
  {
    rules: {
      'no-console': 2, //to enable console error use 1 to disable 0
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
