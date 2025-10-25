import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import OfflinePage from './OfflinePage';

describe('Home', () => {
  /** Base props for OfflinePage **/
  const baseProps = {};

  /**
   * @test
   * Renders the OfflinePage component without throwing an error
   * and checks if the OfflinePageTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<OfflinePage {...baseProps} />);
    expect(screen.getByTestId('OfflinePageTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the OfflinePage component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<OfflinePage {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the OfflinePage component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<OfflinePage {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
