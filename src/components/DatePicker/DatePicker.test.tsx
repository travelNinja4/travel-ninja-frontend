import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DatePicker from './DatePicker'

describe('Home', () => {
  /** Base props for DatePicker **/
  const baseProps={
    label: 'DatePicker Test'
  }
 
  /**
  * @test
  * Renders the DatePicker component without throwing an error
  * and checks if the DatePickerTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<DatePicker {...baseProps}/>);
   expect(screen.getByTestId('DatePickerTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the DatePicker component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<DatePicker {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the DatePicker component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<DatePicker {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})