import { getBreadcrumbs } from './breadcrumbs';
import { NAV_ITEM, ROUTES } from '@/constants/strings';

const dashboard = { label: NAV_ITEM.DASHBOARD, href: ROUTES.DASHBOARD };

describe('getBreadcrumbs', () => {
  it('shows only the Dashboard on the landing screen', () => {
    expect(getBreadcrumbs(ROUTES.DASHBOARD)).toEqual([dashboard]);
  });

  it('falls back to the Dashboard for the root path', () => {
    expect(getBreadcrumbs('/')).toEqual([dashboard]);
  });

  it('puts the Dashboard before a top-level screen', () => {
    expect(getBreadcrumbs(ROUTES.TOURS)).toEqual([
      dashboard,
      { label: NAV_ITEM.TOURS, href: ROUTES.TOURS },
    ]);
  });

  it('turns unknown segments into unlinked words', () => {
    expect(getBreadcrumbs('/tours/new-departure/')).toEqual([
      dashboard,
      { label: NAV_ITEM.TOURS, href: ROUTES.TOURS },
      { label: 'New departure' },
    ]);
  });

  it('leaves out numeric ids', () => {
    expect(getBreadcrumbs('/tours/12/edit')).toEqual([
      dashboard,
      { label: NAV_ITEM.TOURS, href: ROUTES.TOURS },
      { label: 'Edit' },
    ]);
  });

  // Restore with the Insights section in SidebarNav
  // it('labels nested sidebar routes and leaves their group unlinked', () => {
  //   expect(getBreadcrumbs(ROUTES.REVENUE)).toEqual([
  //     dashboard,
  //     { label: 'Insights' },
  //     { label: NAV_ITEM.REVENUE, href: ROUTES.REVENUE },
  //   ]);
  // });

  it('labels the agency profile from the sidebar', () => {
    expect(getBreadcrumbs(ROUTES.AGENCY_PROFILE)).toEqual([
      dashboard,
      { label: NAV_ITEM.AGENCY_PROFILE, href: ROUTES.AGENCY_PROFILE },
    ]);
  });

  it('does not repeat the Dashboard for routes under it', () => {
    expect(getBreadcrumbs('/dashboard/overview')).toEqual([dashboard, { label: 'Overview' }]);
  });

  it('decodes encoded segments and survives malformed ones', () => {
    expect(getBreadcrumbs('/tours/goa%20trip').at(-1)).toEqual({ label: 'Goa trip' });
    expect(getBreadcrumbs('/tours/%E0%A4').at(-1)).toEqual({ label: '%E0%A4' });
  });
});
