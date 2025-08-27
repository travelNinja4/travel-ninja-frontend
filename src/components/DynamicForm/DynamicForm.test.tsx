import '@testing-library/jest-dom';
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
    onSubmit: jest.fn(),
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

  /**
   * @test
   * Captures a snapshot of the DynamicForm component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<DynamicForm {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
