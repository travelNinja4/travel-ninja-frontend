import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { SEARCH_INPUT } from '@/constants/strings';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const getInput = () => screen.getByRole('searchbox');
  const type = (value: string) => fireEvent.change(getInput(), { target: { value } });
  const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

  /**
   * @test
   * Renders the SearchInput component with the default placeholder
   * and uses it as the accessible name when there is no label.
   */
  it('renders without crashing', () => {
    render(<SearchInput />);
    expect(screen.getByTestId('SearchInputTest')).toBeInTheDocument();
    expect(getInput()).toHaveAttribute('placeholder', SEARCH_INPUT.PLACEHOLDER);
    expect(getInput()).toHaveAccessibleName(SEARCH_INPUT.PLACEHOLDER);
  });

  it('uses the label as the accessible name when given', () => {
    render(<SearchInput label="Find a tour" />);
    expect(screen.getByRole('searchbox', { name: 'Find a tour' })).toBeInTheDocument();
  });

  it('calls onChange on every keystroke but onSearch once typing pauses', () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    render(<SearchInput onChange={onChange} onSearch={onSearch} debounceMs={300} />);

    type('k');
    wait(100);
    type('ky');
    wait(100);
    type('kyo');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onSearch).not.toHaveBeenCalled();

    wait(299);
    expect(onSearch).not.toHaveBeenCalled();

    wait(1);
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('kyo', expect.any(AbortSignal));
  });

  it('trims the term and skips repeats of the last search', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);

    type('  bali ');
    wait(300);
    type('bali');
    wait(300);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('bali', expect.any(AbortSignal));
  });

  it('searches terms shorter than minChars as an empty string', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} minChars={3} />);

    type('pari');
    wait(300);
    type('pa');
    wait(300);

    expect(onSearch.mock.calls.map(([term]) => term)).toEqual(['pari', '']);
  });

  it('searches straight away on Enter', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);

    type('cairo');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('cairo', expect.any(AbortSignal));

    // The pending debounced search was dropped
    wait(300);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('searches for an empty string straight away when the text is deleted', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);

    type('rome');
    wait(300);
    type('');

    expect(onSearch).toHaveBeenLastCalledWith('', expect.any(AbortSignal));
  });

  it('clears the box and refocuses the input from the clear button', () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    render(<SearchInput onSearch={onSearch} onClear={onClear} defaultValue="lima" />);

    fireEvent.click(screen.getByRole('button', { name: SEARCH_INPUT.CLEAR }));

    expect(getInput()).toHaveValue('');
    expect(getInput()).toHaveFocus();
    expect(onSearch).toHaveBeenCalledWith('', expect.any(AbortSignal));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: SEARCH_INPUT.CLEAR })).not.toBeInTheDocument();
  });

  it('clears the box on Escape', () => {
    render(<SearchInput defaultValue="oslo" />);
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(getInput()).toHaveValue('');
  });

  it('hides the clear button when empty, disabled or read-only', () => {
    const { rerender } = render(<SearchInput />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<SearchInput defaultValue="oslo" disabled />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<SearchInput defaultValue="oslo" readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows a spinner in place of the clear button while loading', () => {
    render(<SearchInput defaultValue="goa" loading />);
    expect(screen.getByRole('status', { name: SEARCH_INPUT.LOADING })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: SEARCH_INPUT.CLEAR })).not.toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-busy', 'true');
  });

  it('aborts the previous search when a newer one starts', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);

    type('nepal');
    wait(300);
    const firstSignal: AbortSignal = onSearch.mock.calls[0][1];
    expect(firstSignal.aborted).toBe(false);

    type('peru');
    wait(300);
    expect(firstSignal.aborted).toBe(true);
    expect(onSearch.mock.calls[1][1].aborted).toBe(false);
  });

  it('drops the pending search and aborts the last one on unmount', () => {
    const onSearch = vi.fn();
    const { unmount } = render(<SearchInput onSearch={onSearch} />);

    type('fiji');
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    type('fiji islands');
    unmount();
    wait(300);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch.mock.calls[0][1].aborted).toBe(true);
  });

  it('waits for an IME composition to end before searching', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);

    fireEvent.compositionStart(getInput());
    type('とう');
    wait(300);
    expect(onSearch).not.toHaveBeenCalled();

    fireEvent.compositionEnd(getInput(), { data: '東京' });
    wait(300);
    expect(onSearch).toHaveBeenCalledWith('とう', expect.any(AbortSignal));
  });

  it('works as a controlled input', () => {
    const onSearch = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          value={value}
          onChange={(next) => setValue(next.toUpperCase())}
          onSearch={onSearch}
        />
      );
    }
    render(<Controlled />);

    type('dubai');
    expect(getInput()).toHaveValue('DUBAI');

    fireEvent.click(screen.getByRole('button', { name: SEARCH_INPUT.CLEAR }));
    expect(getInput()).toHaveValue('');
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBe(getInput());
  });
});
