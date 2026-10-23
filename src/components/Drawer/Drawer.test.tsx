import { fireEvent, render, screen } from '@testing-library/react';
import { Pencil } from 'lucide-react';
import Drawer, { DrawerProps } from './Drawer';

describe('Drawer', () => {
  const setup = (props: Partial<DrawerProps> = {}) => {
    const onClose = vi.fn();
    const view = render(
      <Drawer open title="Sneha Krishnan" onClose={onClose} {...props}>
        <button type="button">View booking</button>
      </Drawer>,
    );
    return { onClose, dialog: screen.getByTestId('DrawerTest'), ...view };
  };

  const pressEscape = (dialog: HTMLElement) =>
    fireEvent(dialog, new Event('cancel', { cancelable: true }));

  it('opens as a modal named by its title', () => {
    const { dialog } = setup();
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('dialog', { name: 'Sneha Krishnan' })).toBe(dialog);
    expect(screen.getByRole('heading', { name: 'Sneha Krishnan' })).toBeInTheDocument();
  });

  it('renders nothing inside while closed, and opens and closes with `open`', () => {
    const { dialog, rerender } = setup({ open: false });
    expect(dialog).not.toHaveAttribute('open');
    expect(screen.queryByText('Sneha Krishnan')).not.toBeInTheDocument();

    rerender(
      <Drawer open title="Details" onClose={vi.fn()}>
        Shown
      </Drawer>,
    );
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText('Shown')).toBeInTheDocument();

    rerender(
      <Drawer open={false} title="Details" onClose={vi.fn()}>
        Shown
      </Drawer>,
    );
    expect(dialog).not.toHaveAttribute('open');
  });

  it('asks to close on the close button, Escape and a backdrop click, but not on a click inside', () => {
    const { onClose, dialog } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'View booking' }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    pressEscape(dialog);
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(3);
    // The parent decides: none of them close it on their own
    expect(dialog).toHaveAttribute('open');
  });

  it('ignores Escape, backdrop clicks and disables the close button when not dismissible', () => {
    const { onClose, dialog } = setup({ dismissible: false });
    pressEscape(dialog);
    fireEvent.click(dialog);
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('accepts a custom close icon and label, and applies the size', () => {
    const { dialog } = setup({ closeIcon: Pencil, closeLabel: 'Close details', size: 'lg' });
    const close = screen.getByRole('button', { name: 'Close details' });
    expect(close.querySelector('.lucide-pencil')).toBeInTheDocument();
    expect(dialog).toHaveClass('lg');
  });
});
