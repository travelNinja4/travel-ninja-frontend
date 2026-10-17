import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import ClientNetworkWrapper from './ClientNetworkWrapper';

vi.mock('../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: vi.fn(),
}));

describe('Home', () => {
  /** Base props for ClientNetworkWrapper **/
  const baseProps = {
    children: <div data-testid="ClientNetworkWrapperTest">Test Child</div>,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  /**
   * @test
   * Ensures that the ClientNetworkWrapper component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<ClientNetworkWrapper {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the ClientNetworkWrapper component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<ClientNetworkWrapper {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders children when online', () => {
    (useNetworkStatus as Mock).mockReturnValue(true);
    render(<ClientNetworkWrapper {...baseProps} />);
    expect(screen.getByTestId('ClientNetworkWrapperTest')).toBeInTheDocument();
  });

  it('renders OfflinePage when offline', () => {
    (useNetworkStatus as Mock).mockReturnValue(false);
    render(<ClientNetworkWrapper {...baseProps} />);
    expect(screen.getByText(/You’re offline/i)).toBeInTheDocument();
  });

  it('renders nothing before hydration', () => {
    (useNetworkStatus as Mock).mockReturnValue(true);

    // Effects never run during server rendering, so this is the pre-hydration output
    expect(renderToString(<ClientNetworkWrapper {...baseProps} />)).toBe('');
  });
});
