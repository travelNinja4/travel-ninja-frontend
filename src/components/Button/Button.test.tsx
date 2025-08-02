import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Home', () => {
  /** Base props for Button **/
  const baseProps={}
 
  /**
  * @test
  * Renders the Button component without throwing an error
  * and checks if the ButtonTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<Button {...baseProps}/>);
   expect(screen.getByTestId('ButtonTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the Button component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<Button {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the Button component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<Button {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})