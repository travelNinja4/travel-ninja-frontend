import { render, screen } from '@testing-library/react';
import BaseLayout from './BaseLayout';

vi.mock('../Sidebar', () => ({
  default: () => <aside data-testid="SidebarTest" />,
}));

describe('BaseLayout', () => {
  const baseProps = {
    children: <div data-testid="BaseLayoutChild">BaseLayout Test</div>,
  };

  it('renders the sidebar and the page content inside main', () => {
    render(<BaseLayout {...baseProps} />);

    expect(screen.getByTestId('BaseLayoutTest')).toBeInTheDocument();
    expect(screen.getByTestId('SidebarTest')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(screen.getByTestId('BaseLayoutChild'));
  });
});
