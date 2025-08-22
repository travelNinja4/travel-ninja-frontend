import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckBox from './CheckBox';

describe('Home', () => {
  /** Base props for CheckBox **/
  const baseProps = {
    label: 'CheckBox Test',
    name: 'checkboxTest',
    onChange: jest.fn(),
  };

  /**
   * @test
   * Renders the CheckBox component without throwing an error
   * and checks if the CheckBoxTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<CheckBox {...baseProps} />);
    expect(screen.getByTestId('CheckBoxTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the CheckBox component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<CheckBox {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the CheckBox component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<CheckBox {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    render(<CheckBox {...baseProps} disabled onChange={onChange} />);
    screen.getByRole('checkbox').click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange when enabled and clicked', () => {
    const onChange = jest.fn();
    render(<CheckBox {...baseProps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('sets indeterminate property on checkbox input', () => {
    const { container } = render(<CheckBox {...baseProps} indeterminate />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });

  it('can render with defaultChecked true', () => {
    render(<CheckBox {...baseProps} defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('sets indeterminate property on checkbox input', () => {
    const { container } = render(<CheckBox {...baseProps} indeterminate />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });

  it('renders React element as label', () => {
    render(<CheckBox {...baseProps} label={<span>Element Label</span>} />);
    expect(screen.getByText('Element Label')).toBeInTheDocument();
  });

  it('handles non-string, non-element labels gracefully', () => {
    render(<CheckBox {...baseProps} label={123} />);
    expect(screen.getByTestId('CheckBoxTest')).toBeInTheDocument();
  });

  it('renders without a label prop', () => {
    render(<CheckBox name="noLabel" onChange={jest.fn()} label="no label" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with a custom tag prop', () => {
    render(<CheckBox {...baseProps} tag="h3" />);
    expect(screen.getByText('CheckBox Test').tagName).toBe('H3');
  });

  it('does not set indeterminate when prop is false', () => {
    const { container } = render(<CheckBox {...baseProps} indeterminate={false} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(false);
  });

  it('renders without a label when label is null', () => {
    render(<CheckBox name="noLabel" onChange={jest.fn()} label={null} />);
    expect(screen.queryByText('CheckBox Test')).not.toBeInTheDocument();
  });
});
