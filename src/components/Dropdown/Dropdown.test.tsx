import { render, screen, fireEvent } from '@testing-library/react';
import { STRINGS } from '@/constants/strings';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  /** Base props for Dropdown **/
  const baseProps = {
    label: 'Status',
    options: [
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'pending', label: 'Pending' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  };

  const getCombobox = () => screen.getByRole('combobox');

  /**
   * @test
   * Renders the Dropdown component without throwing an error
   * and checks if the DropdownTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<Dropdown {...baseProps} />);
    expect(screen.getByTestId('DropdownTest')).toBeInTheDocument();
  });

  it('associates the label with the combobox', () => {
    render(<Dropdown {...baseProps} />);
    expect(screen.getByLabelText('Status')).toBe(getCombobox());
  });

  it('is closed by default and opens on click', () => {
    render(<Dropdown {...baseProps} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getCombobox()).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(getCombobox());

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(getCombobox()).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes when clicked again', () => {
    render(<Dropdown {...baseProps} />);
    fireEvent.click(getCombobox());
    fireEvent.click(getCombobox());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows the selected option label, not the raw value', () => {
    render(<Dropdown {...baseProps} value="pending" />);
    expect(getCombobox()).toHaveValue('Pending');
  });

  it('calls onChange with the value and option when an option is clicked', () => {
    const onChange = vi.fn();
    render(<Dropdown {...baseProps} onChange={onChange} />);

    fireEvent.click(getCombobox());
    fireEvent.click(screen.getByRole('option', { name: 'Cancelled' }));

    expect(onChange).toHaveBeenCalledWith('cancelled', baseProps.options[2]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates its own value when uncontrolled', () => {
    render(<Dropdown {...baseProps} defaultValue="confirmed" />);
    expect(getCombobox()).toHaveValue('Confirmed');

    fireEvent.click(getCombobox());
    fireEvent.click(screen.getByRole('option', { name: 'Pending' }));

    expect(getCombobox()).toHaveValue('Pending');
  });

  it('keeps the parent value when controlled', () => {
    render(<Dropdown {...baseProps} value="confirmed" onChange={vi.fn()} />);

    fireEvent.click(getCombobox());
    fireEvent.click(screen.getByRole('option', { name: 'Pending' }));

    expect(getCombobox()).toHaveValue('Confirmed');
  });

  it('marks the selected option with aria-selected', () => {
    render(<Dropdown {...baseProps} value="pending" />);
    fireEvent.click(getCombobox());
    expect(screen.getByRole('option', { name: 'Pending' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Confirmed' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('opens with ArrowDown and selects with the keyboard', () => {
    const onChange = vi.fn();
    render(<Dropdown {...baseProps} onChange={onChange} />);
    const combobox = getCombobox();

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute('aria-activedescendant', expect.stringMatching(/option-0$/));

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('pending', baseProps.options[1]);
  });

  it('wraps around with ArrowUp and supports Home/End', () => {
    render(<Dropdown {...baseProps} />);
    const combobox = getCombobox();

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'ArrowUp' });
    expect(combobox).toHaveAttribute('aria-activedescendant', expect.stringMatching(/option-2$/));

    fireEvent.keyDown(combobox, { key: 'Home' });
    expect(combobox).toHaveAttribute('aria-activedescendant', expect.stringMatching(/option-0$/));

    fireEvent.keyDown(combobox, { key: 'End' });
    expect(combobox).toHaveAttribute('aria-activedescendant', expect.stringMatching(/option-2$/));
  });

  it('highlights the selected option when opened', () => {
    render(<Dropdown {...baseProps} value="cancelled" />);
    fireEvent.click(getCombobox());
    expect(getCombobox()).toHaveAttribute(
      'aria-activedescendant',
      expect.stringMatching(/option-2$/),
    );
  });

  it('closes on Escape and Tab', () => {
    render(<Dropdown {...baseProps} />);
    const combobox = getCombobox();

    fireEvent.click(combobox);
    fireEvent.keyDown(combobox, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.click(combobox);
    fireEvent.keyDown(combobox, { key: 'Tab' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(<Dropdown {...baseProps} />);
    fireEvent.click(getCombobox());
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows the empty state and ignores Enter when there are no options', () => {
    const onChange = vi.fn();
    render(<Dropdown {...baseProps} options={[]} onChange={onChange} />);

    fireEvent.click(getCombobox());
    expect(screen.getByText(STRINGS.NO_OPTIONS_FOUND)).toBeInTheDocument();

    expect(() => fireEvent.keyDown(getCombobox(), { key: 'Enter' })).not.toThrow();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows the loading state instead of options', () => {
    render(<Dropdown {...baseProps} isLoading />);
    fireEvent.click(getCombobox());
    expect(screen.getByText(STRINGS.LOADING)).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<Dropdown {...baseProps} disabled />);
    expect(getCombobox()).toBeDisabled();
    fireEvent.click(getCombobox());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('passes error and required through to the field', () => {
    render(<Dropdown {...baseProps} required error="Pick a status" />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a status');
    expect(getCombobox()).toHaveAttribute('aria-invalid', 'true');
  });

  describe('list placement', () => {
    // Puts the bordered field `top` px down a 768px-tall window; the wrapper starts 20px above it
    const placeField = (top: number) => {
      const field = getCombobox().parentElement!;
      const wrapper = screen.getByTestId('DropdownTest');
      const rect = (t: number, height: number) => ({ top: t, bottom: t + height }) as DOMRect;
      field.getBoundingClientRect = () => rect(top, 40);
      wrapper.getBoundingClientRect = () => rect(top - 20, 60);
    };

    it('opens below the field when there is room', () => {
      render(<Dropdown {...baseProps} />);
      placeField(100);
      fireEvent.click(getCombobox());
      expect(screen.getByRole('listbox')).toHaveStyle({ top: '64px' });
    });

    it('opens above the field near the bottom of the window', () => {
      render(<Dropdown {...baseProps} />);
      placeField(700);
      fireEvent.click(getCombobox());
      expect(screen.getByRole('listbox')).toHaveStyle({ top: 'auto', bottom: '44px' });
    });
  });
});
