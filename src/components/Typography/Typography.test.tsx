import '@testing-library/jest-dom';
import { ElementType } from 'react';
import { render, screen } from '@testing-library/react';
import Typography, { TypographyProps } from './Typography';

describe('Home', () => {
  /** Base props for Typography **/
  const baseProps: TypographyProps = {
    tag: 'p',
    children: 'Typography Test',
    align: 'left',
  };

  /**
   * @test
   * Renders the Typography component without throwing an error
   * and checks if the TypographyTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<Typography {...baseProps} />);
    expect(screen.getByTestId('TypographyTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the Typography component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<Typography {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the Typography component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<Typography {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders using the "as" prop instead of tag', () => {
    render(
      <Typography {...baseProps} as="strong">
        Strong text
      </Typography>,
    );
    const el = screen.getByText('Strong text');
    expect(el.tagName.toLowerCase()).toBe('strong');
  });

  it.each(['uppercase', 'lowercase', 'capitalize'] as const)(
    'applies transform class for %s',
    (transform) => {
      render(<Typography {...baseProps} transform={transform} />);
      expect(screen.getByTestId('TypographyTest')).toHaveClass(`transform-${transform}`);
    },
  );

  it.each(['ellipsis', 'noWrap', 'lineClamp-3'] as const)(
    'applies truncation class for %s',
    (truncation) => {
      render(<Typography {...baseProps} truncation={truncation} />);
      expect(screen.getByTestId('TypographyTest')).toHaveClass(truncation);
    },
  );

  it('falls back to <p> tag if tag is missing', () => {
    render(
      <Typography
        as={undefined as ElementType | undefined}
        tag={undefined as unknown as TypographyProps['tag']}
      >
        Fallback text
      </Typography>,
    );
    const el = screen.getByText('Fallback text');
    expect(el.tagName.toLowerCase()).toBe('p');
  });
});
