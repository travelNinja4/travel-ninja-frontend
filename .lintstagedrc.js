// referred Next.js documentation https://nextjs.org/docs/app/api-reference/config/eslint
// `next lint` was removed in Next.js 16, so staged files go straight to the ESLint CLI.

// this config is loaded as CommonJS, so require() is correct here
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx,json,css,scss}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
