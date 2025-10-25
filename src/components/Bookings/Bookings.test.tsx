import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Bookings from './Bookings'

describe('Home', () => {
  /** Base props for Bookings **/
  const baseProps={
    label: 'Bookings Test'
  }
 
  /**
  * @test
  * Renders the Bookings component without throwing an error
  * and checks if the BookingsTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<Bookings {...baseProps}/>);
   expect(screen.getByTestId('BookingsTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the Bookings component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<Bookings {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the Bookings component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<Bookings {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})