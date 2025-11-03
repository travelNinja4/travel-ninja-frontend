import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LeftSidebar from './LeftSidebar'

describe('Home', () => {
  /** Base props for LeftSidebar **/
  const baseProps={
    label: 'LeftSidebar Test'
  }
 
  /**
  * @test
  * Renders the LeftSidebar component without throwing an error
  * and checks if the LeftSidebarTest text is present in the document.
  *
  * This ensures that the component loads correctly with the base props.
  */
  it('renders without crashing', () => {
   render(<LeftSidebar {...baseProps}/>);
   expect(screen.getByTestId('LeftSidebarTest')).toBeInTheDocument();
  });

  /**
  * @test
  * Ensures that the LeftSidebar component renders without throwing any runtime errors.
  *
  * This is a safety check to confirm that the component can mount successfully
  * with the provided base props, even if it does not render any visible content.
  */
  it('renders without throwing', () => {
  expect(() => render(<LeftSidebar {...baseProps}/>)).not.toThrow();
  });

  /**
  * @test
  * Captures a snapshot of the LeftSidebar component with base props
  * and ensures it matches the previously stored snapshot.
  *
  * This helps detect any unexpected UI changes.
  */
  it('matches snapshot', () => {
   const { asFragment } = render(<LeftSidebar {...baseProps}/>);
   expect(asFragment()).toMatchSnapshot();
  });
})