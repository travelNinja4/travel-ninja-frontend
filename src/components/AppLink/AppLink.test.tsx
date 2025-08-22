import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AppLink from './AppLink';

describe('Home', () => {
  /** Base props for AppLink **/
  const baseProps = {
    href: '/test',
    children: <span>AppLink Test</span>,
  };

  /**
   * @test
   * Renders the AppLink component without throwing an error
   * and checks if the AppLinkTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<AppLink {...baseProps} />);
    expect(screen.getByTestId('AppLinkTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the AppLink component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<AppLink {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the AppLink component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<AppLink {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders an external link with correct attributes', () => {
    render(
      <AppLink href="https://example.com" isExternal>
        External Link
      </AppLink>,
    );
    const link = screen.getByRole('link', { name: /external link/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
