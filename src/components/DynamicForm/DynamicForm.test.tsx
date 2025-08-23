import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DynamicForm from './DynamicForm'

describe('Home', () => {
  /** Base props for DynamicForm **/
  const baseProps={
    label: 'DynamicForm Test'
  }
 
  /**
  * @test
  * Renders the DynamicForm component without throwing an error
  * and checks if the DynamicFormTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<DynamicForm {...baseProps}/>);
   expect(screen.getByTestId('DynamicFormTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the DynamicForm component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<DynamicForm {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the DynamicForm component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<DynamicForm {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})