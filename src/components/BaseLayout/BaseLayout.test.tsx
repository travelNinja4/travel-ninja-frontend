import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BaseLayout from './BaseLayout'

describe('Home', () => {
  /** Base props for BaseLayout **/
  const baseProps={
    label: 'BaseLayout Test'
  }
 
  /**
  * @test
  * Renders the BaseLayout component without throwing an error
  * and checks if the BaseLayoutTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<BaseLayout {...baseProps}/>);
   expect(screen.getByTestId('BaseLayoutTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the BaseLayout component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<BaseLayout {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the BaseLayout component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<BaseLayout {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})