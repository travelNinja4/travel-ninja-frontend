import { fireEvent, render, screen } from '@testing-library/react';
import Modal, { ModalProps } from './Modal';

describe('Modal', () => {
  const setup = (props: Partial<ModalProps> = {}) => {
    const onClose = vi.fn();
    const view = render(
      <Modal open onClose={onClose} aria-labelledby="title" {...props}>
        <h2 id="title">Share tour</h2>
        <button type="button">Copy link</button>
      </Modal>,
    );
    return { onClose, dialog: screen.getByTestId('ModalTest'), ...view };
  };

  const pressEscape = (dialog: HTMLElement) =>
    fireEvent(dialog, new Event('cancel', { cancelable: true }));

  it('opens as a modal named by its title', () => {
    const { dialog } = setup();
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('dialog', { name: 'Share tour' })).toBe(dialog);
  });

  it('renders nothing inside while closed, and opens and closes with `open`', () => {
    const { dialog, rerender } = setup({ open: false });
    expect(dialog).not.toHaveAttribute('open');
    expect(screen.queryByText('Share tour')).not.toBeInTheDocument();

    rerender(
      <Modal open onClose={vi.fn()}>
        Shown
      </Modal>,
    );
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText('Shown')).toBeInTheDocument();

    rerender(
      <Modal open={false} onClose={vi.fn()}>
        Shown
      </Modal>,
    );
    expect(dialog).not.toHaveAttribute('open');
  });

  it('asks to close on Escape and on a backdrop click, but not on a click inside', () => {
    const { onClose, dialog } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(onClose).not.toHaveBeenCalled();

    pressEscape(dialog);
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);
    // The parent decides: Escape alone doesn't close it
    expect(dialog).toHaveAttribute('open');
  });

  it('ignores Escape and backdrop clicks when not dismissible', () => {
    const { onClose, dialog } = setup({ dismissible: false });
    pressEscape(dialog);
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies the size and role', () => {
    const { dialog } = setup({ size: 'lg', role: 'alertdialog' });
    expect(dialog).toHaveClass('lg');
    expect(dialog).toHaveAttribute('role', 'alertdialog');
  });
});
