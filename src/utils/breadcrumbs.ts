/**
 * Builds the header breadcrumb trail from a pathname.
 *
 * The trail always starts at the Dashboard (the landing screen), so
 * `/dashboard` gives `Dashboard` and `/tours/new` gives
 * `Dashboard / Tours / New`. Page names come from the sidebar navigation, so a
 * screen added there is labelled here too; other segments are turned into words.
 *
 * Only crumbs for known screens link anywhere: an unknown segment (an id, or a
 * group like `/insights`) may have no page of its own.
 *
 * @example
 * ```ts
 * getBreadcrumbs('/insights/revenue');
 * // [{ label: 'Dashboard', href: '/dashboard' },
 * //  { label: 'Insights' },
 * //  { label: 'Revenue', href: '/insights/revenue' }]
 * ```
 */

import { NAV_SECTIONS } from '@/components/SidebarNav/SidebarNav';
import { NAV_ITEM, ROUTES } from '@/constants/strings';

export interface BreadcrumbItem {
  label: string;
  /** Omitted when the crumb has no page to link to. */
  href?: string;
}

const ROUTE_LABELS = new Map<string, string>(
  NAV_SECTIONS.flatMap(({ items }) => items.map(({ href, label }) => [href, label])),
);

const ROOT: BreadcrumbItem = { label: NAV_ITEM.DASHBOARD, href: ROUTES.DASHBOARD };

/** `tour-packages` -> `Tour packages` */
const humanize = (segment: string) => {
  let text = segment;
  try {
    text = decodeURIComponent(segment);
  } catch {
    // Malformed escape sequence: show the segment as it is
  }
  text = text.replace(/[-_]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const crumbs = [ROOT];
  let path = '';

  for (const segment of pathname.split('/')) {
    if (!segment) continue;
    path += `/${segment}`;
    // Already the root crumb
    if (path === ROUTES.DASHBOARD) continue;

    const label = ROUTE_LABELS.get(path);
    crumbs.push(label ? { label, href: path } : { label: humanize(segment) });
  }

  return crumbs;
};
