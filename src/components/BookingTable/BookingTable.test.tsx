import { render, screen } from '@testing-library/react';
import BookingTable from './BookingTable';

describe('Home', () => {
  /** Base props for BookingTable **/
  const baseProps = {};

  /**
   * @test
   * Renders the BookingTable component without throwing an error
   * and checks if the BookingTableTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<BookingTable {...baseProps} />);
    expect(screen.getByTestId('BookingTableTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the BookingTable component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<BookingTable {...baseProps} />)).not.toThrow();
  });
});
