/**
 * App Router context for screen stories. Storybook 9.1's built-in
 * `nextjs.appDirectory` provider predates Next 16, whose `useRouter` reads
 * `LayoutRouterContext.parentRenderTree.data`, so it crashes. This decorator
 * provides just enough context for `useRouter` and uses Storybook's mocked
 * router, so calls like `router.push` still show up in the Actions panel.
 */
import type { Decorator } from '@storybook/nextjs-vite';
import { createNavigation } from '@storybook/nextjs-vite/navigation.mock';
import {
  AppRouterContext,
  LayoutRouterContext,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const withAppRouter: Decorator = (Story) => {
  const router = createNavigation({});
  const layout = { parentRenderTree: { data: { bfcacheId: 0 } } };

  return (
    // The real context values carry many more fields; useRouter only reads these
    <AppRouterContext.Provider value={router as never}>
      <LayoutRouterContext.Provider value={layout as never}>
        <Story />
      </LayoutRouterContext.Provider>
    </AppRouterContext.Provider>
  );
};
