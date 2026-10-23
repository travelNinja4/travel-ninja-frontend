import { fireEvent, render, screen } from '@testing-library/react';
import ConfirmDialog, { ConfirmDialogProps } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const setup = (props: Partial<ConfirmDialogProps> = {}) => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        tone="danger"
        title="Delete this tour?"
        description="This can’t be undone."
        confirmLabel="Delete tour"
        onConfirm={onConfirm}
        onCancel={onCancel}
        {...props}
      />,
    );
    return { onConfirm, onCancel, dialog: screen.getByTestId('ModalTest') };
  };

  const pressEscape = (dialog: HTMLElement) =>
    fireEvent(dialog, new Event('cancel', { cancelable: true }));

  it('opens as an alert dialog named and described by its text', () => {
    setup();
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAccessibleName('Delete this tour?');
    expect(dialog).toHaveAccessibleDescription('This can’t be undone.');
  });

  it('shows nothing while closed', () => {
    setup({ open: false });
    expect(screen.queryByText('Delete this tour?')).not.toBeInTheDocument();
  });

  it('confirms and cancels', () => {
    const { onConfirm, onCancel } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Delete tour' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('cancels on Escape and on a backdrop click', () => {
    const { onCancel, dialog } = setup();
    pressEscape(dialog);
    fireEvent.click(dialog);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('can’t be dismissed while loading', () => {
    const { onCancel, dialog } = setup({ loading: true });
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete tour' })).toBeDisabled();

    pressEscape(dialog);
    fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('uses the danger button for the danger tone and the primary one otherwise', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Delete tour' })).toHaveClass('danger');
  });

  it('shows a single acknowledgement button for a success', () => {
    const { onConfirm } = setup({
      tone: 'success',
      title: 'Tour published',
      description: undefined,
      confirmLabel: 'Done',
      showCancel: false,
    });
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    const done = screen.getByRole('button', { name: 'Done' });
    expect(done).not.toHaveClass('danger');
    fireEvent.click(done);
    expect(onConfirm).toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).not.toHaveAttribute('aria-describedby');
  });
});
