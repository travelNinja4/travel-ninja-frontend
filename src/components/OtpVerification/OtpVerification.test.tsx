import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import OtpVerification from './OtpVerification'

describe('Home', () => {
  /** Base props for OtpVerification **/
  const baseProps={
    label: 'OtpVerification Test'
  }
 
  /**
  * @test
  * Renders the OtpVerification component without throwing an error
  * and checks if the OtpVerificationTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<OtpVerification {...baseProps}/>);
   expect(screen.getByTestId('OtpVerificationTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the OtpVerification component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<OtpVerification {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the OtpVerification component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<OtpVerification {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})