import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { APP_HEADER, THEME } from '@/constants/strings';

const root = document.documentElement;

describe('ThemeToggle', () => {
  afterEach(() => {
    localStorage.clear();
    delete root.dataset.theme;
  });

  it('renders an accessible button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: APP_HEADER.TOGGLE_THEME })).toBeInTheDocument();
  });

  it('re-applies the saved theme on mount', () => {
    localStorage.setItem(THEME.STORAGE_KEY, THEME.DARK);
    render(<ThemeToggle />);
    expect(root.dataset.theme).toBe(THEME.DARK);
  });

  it('ignores unknown saved values', () => {
    localStorage.setItem(THEME.STORAGE_KEY, 'sepia');
    render(<ThemeToggle />);
    expect(root.dataset.theme).toBeUndefined();
  });

  it('switches from the OS theme (light here) to dark, then back, saving each choice', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: APP_HEADER.TOGGLE_THEME });

    fireEvent.click(button);
    expect(root.dataset.theme).toBe(THEME.DARK);
    expect(localStorage.getItem(THEME.STORAGE_KEY)).toBe(THEME.DARK);

    fireEvent.click(button);
    expect(root.dataset.theme).toBe(THEME.LIGHT);
    expect(localStorage.getItem(THEME.STORAGE_KEY)).toBe(THEME.LIGHT);
  });
});
