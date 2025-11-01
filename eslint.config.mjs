// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import storybook from 'eslint-plugin-storybook';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  // Extend Next.js and Storybook recommended configs
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 2, // to enable console error use 1, to disable 0
    },
  },

  // Override default ignores (Next.js build folders, etc.)
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**', 'dist/**']),
]);

export default eslintConfig;
