import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Home', () => {
  /** Base props for Button **/
  const baseProps = {
    children: 'ButtonTest',
    onClick: vi.fn(),
    type: 'button' as const,
    disabled: false,
    className: 'test-class',
  };

  /**
   * @test
   * Renders the Button component without throwing an error
   * and checks if the ButtonTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<Button {...baseProps} />);
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
    expect(() => render(<Button {...baseProps} />)).not.toThrow();
  });

  it('renders loading state with loader', () => {
    render(<Button {...baseProps} loading />);
    expect(screen.getByTestId('ButtonTest')).toBeDisabled();
    expect(screen.getByText('ButtonTest')).toBeInTheDocument();
    expect(screen.getByText('ButtonTest').previousSibling).toHaveClass('loader');
  });

  it('renders as disabled', () => {
    render(<Button {...baseProps} disabled />);
    expect(screen.getByTestId('ButtonTest')).toBeDisabled();
  });

  it('is the primary (filled) variant by default', () => {
    render(<Button {...baseProps} />);
    expect(screen.getByTestId('ButtonTest')).not.toHaveClass('secondary');
  });

  it('renders the secondary variant', () => {
    render(<Button {...baseProps} variant="secondary" />);
    expect(screen.getByTestId('ButtonTest')).toHaveClass('button', 'secondary');
  });

  it('triggers onClick when clicked', () => {
    render(<Button {...baseProps} />);
    screen.getByTestId('ButtonTest').click();
    expect(baseProps.onClick).toHaveBeenCalled();
  });
});
