// referred Next.js documentation https://nextjs.org/docs/app/api-reference/config/eslint

const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx,json,css,scss}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
