import type { Preview } from '@storybook/nextjs-vite'

// Global base styles and design tokens, as loaded by app/layout.tsx
import '../src/app/globals.css'
import '../src/app/styleguide.scss'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;