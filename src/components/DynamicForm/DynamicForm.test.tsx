import { render, screen } from '@testing-library/react';
import { z } from 'zod';
import DynamicForm, { FieldConfig, FieldWidth } from './DynamicForm';

const mockFields: FieldConfig[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'input',
    placeholder: 'Enter username',
    width: FieldWidth.FULL,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    validationHints: [],
  },
];

const mockSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

describe('Home', () => {
  /** Base props for DynamicForm **/
  const baseProps = {
    fields: mockFields,
    schema: mockSchema,
    className: 'dynamic-form',
    onSubmit: vi.fn(),
  };

  /**
   * @test
   * Renders the DynamicForm component without throwing an error
   * and checks if the DynamicFormTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<DynamicForm {...baseProps} />);
    expect(screen.getByTestId('DynamicFormTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the DynamicForm component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<DynamicForm {...baseProps} />)).not.toThrow();
  });

  it('gives email, phone and website fields their own input types and autofill hints', () => {
    render(
      <DynamicForm
        fields={[
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
          { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
          { name: 'website', label: 'Website', type: 'url' },
          { name: 'pin', label: 'PIN', type: 'input', inputMode: 'numeric' },
        ]}
      />,
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText('Website')).toHaveAttribute('type', 'url');
    expect(screen.getByLabelText('PIN')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('PIN')).toHaveAttribute('inputmode', 'numeric');
  });

  it('keeps layout settings off the input and shows the hint and outside error', () => {
    render(
      <DynamicForm
        fields={[
          {
            name: 'city',
            label: 'City',
            type: 'input',
            width: FieldWidth.HALF,
            helperText: 'Where your office is',
          },
          { name: 'state', label: 'State', type: 'input', error: 'States failed to load' },
        ]}
      />,
    );
    expect(screen.getByLabelText('City')).not.toHaveAttribute('width');
    expect(screen.getByText('Where your office is')).toBeInTheDocument();
    expect(screen.getByText('States failed to load')).toBeInTheDocument();
  });
});
