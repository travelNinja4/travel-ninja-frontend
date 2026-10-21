import { render, screen } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea', () => {
  it('links the label to the textarea', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByLabelText('Description').tagName).toBe('TEXTAREA');
  });

  it('marks required fields with an asterisk', () => {
    render(<TextArea label="Description" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows the error and marks the textarea invalid', () => {
    render(<TextArea label="Description" error="Enter a description" helperText="Hint" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a description');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toHaveAttribute('aria-invalid', 'true');
  });
});
