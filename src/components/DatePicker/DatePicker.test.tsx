import { render, screen, fireEvent } from '@testing-library/react';
import { DATE_PICKER } from '@/constants/strings';
import DatePicker from './DatePicker';

describe('DatePicker', () => {
  /** Base props for DatePicker **/
  const baseProps = { label: 'Departure date' };

  const getInput = () => screen.getByLabelText('Departure date');
  const openCalendar = () => fireEvent.click(getInput());

  /**
   * @test
   * Renders the DatePicker component without throwing an error
   * and checks if the DatePickerTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<DatePicker {...baseProps} />);
    expect(screen.getByTestId('DatePickerTest')).toBeInTheDocument();
  });

  it('shows the default value in the long format', () => {
    render(<DatePicker {...baseProps} defaultValue={'2026-11-14'} />);
    expect(getInput()).toHaveValue('Sat, 14 Nov 2026');
  });

  it('opens on click and closes on Escape', () => {
    render(<DatePicker {...baseProps} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    openCalendar();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<DatePicker {...baseProps} disabled />);
    openCalendar();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selects a day, calls onChange and closes', () => {
    const onChange = vi.fn();
    render(<DatePicker {...baseProps} defaultValue={'2026-11-01'} onChange={onChange} />);
    openCalendar();

    fireEvent.click(screen.getByRole('button', { name: /November 14th/ }));

    expect(onChange).toHaveBeenCalledWith('2026-11-14');
    expect(getInput()).toHaveValue('Sat, 14 Nov 2026');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('zooms out to months and years, then back in to days', () => {
    render(<DatePicker {...baseProps} defaultValue={'2026-11-14'} />);
    openCalendar();

    fireEvent.click(screen.getByRole('button', { name: /November 2026/ }));
    expect(screen.getByRole('button', { name: 'Nov' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /^2026,/ }));
    expect(screen.getByRole('button', { name: /2026 – 2037/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '2027' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mar' }));
    expect(screen.getByRole('button', { name: /March 2027/ })).toBeInTheDocument();
  });

  it('greys out months and years before minDate', () => {
    render(<DatePicker {...baseProps} minDate={'2026-10-27'} defaultValue={'2026-11-14'} />);
    openCalendar();
    fireEvent.click(screen.getByRole('button', { name: /November 2026/ }));

    expect(screen.getByRole('button', { name: 'Sep' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Oct' })).toBeEnabled();
    expect(screen.getByRole('button', { name: DATE_PICKER.PREVIOUS_YEAR })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /^2026,/ }));
    expect(screen.getByRole('button', { name: /2026 – 2037/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: DATE_PICKER.PREVIOUS_YEARS })).toBeDisabled();
  });

  it('clears the selection', () => {
    const onChange = vi.fn();
    render(<DatePicker {...baseProps} defaultValue={'2026-11-14'} onChange={onChange} />);
    openCalendar();

    fireEvent.click(screen.getByRole('button', { name: DATE_PICKER.CLEAR }));

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(getInput()).toHaveValue('');
  });

  it('formats a range', () => {
    render(
      <DatePicker
        {...baseProps}
        mode="range"
        defaultValue={{ from: '2026-11-14', to: '2026-11-20' }}
      />,
    );
    expect(getInput()).toHaveValue('14 Nov 2026 – 20 Nov 2026');
  });

  it('sends a range in the API format', () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        {...baseProps}
        mode="range"
        defaultValue={{ from: '2026-11-14' }}
        onChange={onChange}
      />,
    );
    openCalendar();

    fireEvent.click(screen.getByRole('button', { name: /November 20th/ }));

    expect(onChange).toHaveBeenCalledWith({ from: '2026-11-14', to: '2026-11-20' });
  });

  it('follows a controlled value and leaves it to the parent', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DatePicker {...baseProps} value="2026-11-14" onChange={onChange} />,
    );
    expect(getInput()).toHaveValue('Sat, 14 Nov 2026');

    openCalendar();
    fireEvent.click(screen.getByRole('button', { name: /November 20th/ }));
    expect(onChange).toHaveBeenCalledWith('2026-11-20');
    // Not updated until the parent passes the new value
    expect(getInput()).toHaveValue('Sat, 14 Nov 2026');

    rerender(<DatePicker {...baseProps} value="2026-11-20" onChange={onChange} />);
    expect(getInput()).toHaveValue('Fri, 20 Nov 2026');
  });

  it('submits the API format with forms through a hidden input', () => {
    const { container } = render(
      <DatePicker {...baseProps} name="departureDate" defaultValue="2026-11-14" />,
    );
    expect(container.querySelector('input[type="hidden"][name="departureDate"]')).toHaveValue(
      '2026-11-14',
    );
  });

  it('shows nothing for an invalid value', () => {
    render(<DatePicker {...baseProps} value="2026-02-31" />);
    expect(getInput()).toHaveValue('');
  });
});
