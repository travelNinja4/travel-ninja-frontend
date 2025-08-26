import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AuthSideBanner from './AuthSideBanner';

describe('Home', () => {
  /** Base props for AuthSideBanner **/
  const baseProps = {
    label: 'AuthSideBanner Test',
  };

  /**
   * @test
   * Renders the AuthSideBanner component without throwing an error
   * and checks if the AuthSideBannerTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<AuthSideBanner {...baseProps} />);
    expect(screen.getByTestId('AuthSideBannerTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the AuthSideBanner component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<AuthSideBanner {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the AuthSideBanner component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<AuthSideBanner {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
