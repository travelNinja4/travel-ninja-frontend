import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Autocomplete from './Autocomplete';

describe('Home', () => {
  /** Base props for Autocomplete **/
  const baseProps = {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
    value: '',
    onChange: jest.fn(),
    searchValue: '',
    onSearchChange: jest.fn(),
    placeholder: 'Search...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test
   * Renders the Autocomplete component without throwing an error
   * and checks if the AutocompleteTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<Autocomplete {...baseProps} />);
    expect(screen.getByTestId('AutocompleteTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the Autocomplete component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<Autocomplete {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the Autocomplete component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<Autocomplete {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('opens dropdown on focus and shows options', () => {
    render(<Autocomplete {...baseProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onSearchChange when typing', () => {
    render(<Autocomplete {...baseProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'ap' } });
    expect(baseProps.onSearchChange).toHaveBeenCalledWith('ap');
  });

  it('selects an option on click', () => {
    render(<Autocomplete {...baseProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    const option = screen.getByText('Banana');
    fireEvent.click(option);
    expect(baseProps.onChange).toHaveBeenCalledWith('banana');
  });

  it('navigates options with keyboard and selects with Enter', () => {
    render(<Autocomplete {...baseProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(baseProps.onChange).toHaveBeenCalledWith('banana');
  });

  it('closes dropdown on Escape key', () => {
    render(<Autocomplete {...baseProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not open dropdown when disabled', () => {
    render(<Autocomplete {...baseProps} disabled />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <Autocomplete {...baseProps} />
        <button data-testid="outside">Outside</button>
      </div>,
    );
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('navigates options with ArrowUp and selects with Enter', () => {
    render(<Autocomplete {...baseProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.focus(input);

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(baseProps.onChange).toHaveBeenCalledWith('cherry');
  });
});
