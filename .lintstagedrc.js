// referred Next.js documentation https://nextjs.org/docs/app/api-reference/config/eslint
// `next lint` was removed in Next.js 16, so staged files go straight to the ESLint CLI.

// this config is loaded as CommonJS, so require() is correct here
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// docs-site is a separate Docusaurus project, so the app's ESLint config doesn't apply to it
const buildEslintCommand = (filenames) => {
  const files = filenames
    .map((f) => path.relative(process.cwd(), f))
    .filter((f) => !f.startsWith(`docs-site${path.sep}`));
  return files.length ? `eslint --fix ${files.map((f) => `"${f}"`).join(' ')}` : [];
};

module.exports = {
  '*.{js,jsx,ts,tsx,json,css,scss}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
