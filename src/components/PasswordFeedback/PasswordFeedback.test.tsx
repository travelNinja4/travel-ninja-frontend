import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PasswordFeedback from './PasswordFeedback';

const hints = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'Contains a number', regex: /\d/ },
];

describe('Home', () => {
  /** Base props for PasswordFeedback **/
  const baseProps = {
    value: 'Test123!',
    hints: [
      { label: 'At least 8 characters', regex: /.{8,}/ },
      { label: 'Contains a number', regex: /\d/ },
      { label: 'Contains an uppercase letter', regex: /[A-Z]/ },
      { label: 'Contains a special character', regex: /[!@#$%^&*]/ },
    ],
  };

  /**
   * @test
   * Renders the PasswordFeedback component without throwing an error
   * and checks if the PasswordFeedbackTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<PasswordFeedback {...baseProps} />);
    expect(screen.getByTestId('PasswordFeedbackTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the PasswordFeedback component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<PasswordFeedback {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the PasswordFeedback component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<PasswordFeedback {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders valid hints correctly', () => {
    render(<PasswordFeedback value="Password1" hints={hints} />);

    const firstHint = screen.getByText('At least 8 characters');
    const secondHint = screen.getByText('Contains a number');

    expect(firstHint).toHaveClass('valid');
    expect(secondHint).toHaveClass('valid');
  });

  it('renders invalid hints correctly', () => {
    render(<PasswordFeedback value="short" hints={hints} />);

    const firstHint = screen.getByText('At least 8 characters');
    const secondHint = screen.getByText('Contains a number');

    expect(firstHint).toHaveClass('invalid');
    expect(secondHint).toHaveClass('invalid');
  });
});
