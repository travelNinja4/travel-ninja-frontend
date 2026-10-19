import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OtpInput from './OtpInput';

// Controlled wrapper so the boxes update like they do on the page
function Harness({ initial = '', onChange }: { initial?: string; onChange?: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <OtpInput
      label="Verification code"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

const boxes = () => screen.getAllByRole('textbox') as HTMLInputElement[];

describe('OtpInput', () => {
  it('renders one labelled box per digit inside a named group', () => {
    render(<Harness />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
    expect(boxes()).toHaveLength(6);
    expect(screen.getByLabelText('Digit 1 of 6')).toHaveAttribute('autocomplete', 'one-time-code');
  });

  it('moves to the next box after typing a digit and ignores non-digits', () => {
    render(<Harness />);
    fireEvent.change(boxes()[0], { target: { value: '4' } });
    expect(boxes()[0]).toHaveValue('4');
    expect(boxes()[1]).toHaveFocus();

    fireEvent.change(boxes()[1], { target: { value: 'a' } });
    expect(boxes()[1]).toHaveValue('');
  });

  it('fills every box from a paste', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.paste(boxes()[0], { clipboardData: { getData: () => '12-34 56' } });
    expect(onChange).toHaveBeenLastCalledWith('123456');
    expect(
      boxes()
        .map((b) => b.value)
        .join(''),
    ).toBe('123456');
  });

  it('fills every box from SMS autofill on the first box', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.change(boxes()[0], { target: { value: '987654' } });
    expect(onChange).toHaveBeenLastCalledWith('987654');
  });

  it('replaces the digit in a filled box', () => {
    const onChange = vi.fn();
    render(<Harness initial="123" onChange={onChange} />);
    fireEvent.change(boxes()[1], { target: { value: '29' } });
    expect(onChange).toHaveBeenLastCalledWith('193');
  });

  it('clears the previous box on Backspace from an empty box', () => {
    const onChange = vi.fn();
    render(<Harness initial="12" onChange={onChange} />);
    fireEvent.keyDown(boxes()[2], { key: 'Backspace' });
    expect(onChange).toHaveBeenLastCalledWith('1');
    expect(boxes()[1]).toHaveFocus();
  });

  it('clears a middle box in place and steps back, even without a Backspace keydown (Android)', () => {
    const onChange = vi.fn();
    render(<Harness initial="123456" onChange={onChange} />);
    // Some Android keyboards only send the emptied value, with no "Backspace" key event
    fireEvent.change(boxes()[2], { target: { value: '' } });

    expect(boxes().map((b) => b.value)).toEqual(['1', '2', '', '4', '5', '6']);
    expect(onChange).toHaveBeenLastCalledWith('12456');
    expect(boxes()[1]).toHaveFocus();
  });

  it('fills the gap left by a cleared box without moving the other digits', () => {
    const onChange = vi.fn();
    render(<Harness initial="123456" onChange={onChange} />);
    fireEvent.change(boxes()[2], { target: { value: '' } });
    fireEvent.change(boxes()[2], { target: { value: '9' } });

    expect(onChange).toHaveBeenLastCalledWith('129456');
  });

  it('fills from the first box when a full code is pasted into a later box', () => {
    const onChange = vi.fn();
    render(<Harness initial="12" onChange={onChange} />);
    fireEvent.paste(boxes()[3], { clipboardData: { getData: () => '987654' } });

    expect(onChange).toHaveBeenLastCalledWith('987654');
    expect(boxes()[5]).toHaveFocus();
  });

  it('fills from the pasted box when only part of a code is pasted', () => {
    const onChange = vi.fn();
    render(<Harness initial="12" onChange={onChange} />);
    fireEvent.paste(boxes()[2], { clipboardData: { getData: () => '34' } });

    expect(onChange).toHaveBeenLastCalledWith('1234');
  });

  it('empties every box when the parent resets the value', () => {
    const { rerender } = render(<OtpInput label="Code" value="123456" onChange={vi.fn()} />);
    rerender(<OtpInput label="Code" value="" onChange={vi.fn()} />);
    expect(boxes().every((box) => box.value === '')).toBe(true);
  });

  it('marks the boxes invalid and disabled when asked', () => {
    render(<OtpInput label="Code" value="" onChange={vi.fn()} hasError disabled />);
    boxes().forEach((box) => {
      expect(box).toHaveAttribute('aria-invalid', 'true');
      expect(box).toBeDisabled();
    });
  });
});
