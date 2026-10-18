import { createRef, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import Typography, { TYPOGRAPHY_VARIANTS, TypographyVariant } from './Typography';
import * as T from './Typography';

describe('Typography', () => {
  const text = 'Typography Test';

  /**
   * @test
   * Renders the Typography component without throwing an error
   * and checks if the text is present in the document.
   */
  it('renders without crashing', () => {
    render(<Typography>{text}</Typography>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('defaults to the body variant on a <p>', () => {
    render(<Typography>{text}</Typography>);
    const el = screen.getByText(text);
    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('typography', 'body');
  });

  /**
   * @test
   * The unit project compiles the CSS module, so a class name only exists if the
   * stylesheet defines it. This fails when a variant is added to
   * TYPOGRAPHY_VARIANTS without a matching entry in the type scale.
   */
  it.each(TYPOGRAPHY_VARIANTS)('has styles for the %s variant', (variant) => {
    render(<Typography variant={variant}>{text}</Typography>);
    expect(screen.getByText(text)).toHaveClass(variant);
  });

  it.each([
    ['heading-1', 'H1'],
    ['heading-4', 'H4'],
    ['body-sm', 'P'],
    ['caption', 'SPAN'],
    ['display-lg', 'SPAN'],
  ] as const)('renders %s as a <%s> by default', (variant, tagName) => {
    render(<Typography variant={variant}>{text}</Typography>);
    expect(screen.getByText(text).tagName).toBe(tagName);
  });

  it('changes only the element, not the style, when tag is passed', () => {
    render(
      <Typography variant="display-lg" tag="h2">
        {text}
      </Typography>,
    );
    const el = screen.getByText(text);
    expect(el.tagName).toBe('H2');
    expect(el).toHaveClass('display-lg');
  });

  it('does not pick a variant from the tag', () => {
    render(<Typography tag="h1">{text}</Typography>);
    expect(screen.getByText(text)).toHaveClass('body');
  });

  it.each(['ellipsis', 'noWrap', 'lineClamp-3'] as const)(
    'applies truncation class for %s',
    (truncation) => {
      render(<Typography truncation={truncation}>{text}</Typography>);
      expect(screen.getByText(text)).toHaveClass(truncation);
    },
  );

  it('passes native attributes and the ref to the element', () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <Typography tag="label" htmlFor="email" data-testid="email-label" ref={ref}>
        {text}
      </Typography>,
    );
    const el = screen.getByTestId('email-label');
    expect(el).toHaveAttribute('for', 'email');
    expect(ref.current).toBe(el);
  });

  it('adds the caller className after its own classes', () => {
    render(<Typography className="custom">{text}</Typography>);
    expect(screen.getByText(text).className).toBe('typography body custom');
  });
});

describe('named text components', () => {
  const text = 'Named Test';

  const namedComponents: Record<TypographyVariant, (props: { children: string }) => ReactNode> = {
    'display-2xl': T.Display2xl,
    'display-xl': T.DisplayXl,
    'display-lg': T.DisplayLg,
    'heading-1': T.Heading1,
    'stat-lg': T.StatLg,
    'heading-2': T.Heading2,
    'stat-sm': T.StatSm,
    'heading-3': T.Heading3,
    'heading-4': T.Heading4,
    'title-md': T.TitleMd,
    'body-lg': T.BodyLg,
    'title-sm': T.TitleSm,
    body: T.Body,
    'body-sm': T.BodySm,
    label: T.Label,
    'body-sm-strong': T.BodySmStrong,
    caption: T.Caption,
    'caption-medium': T.CaptionMedium,
    'caption-strong': T.CaptionStrong,
    overline: T.Overline,
    micro: T.Micro,
    'micro-medium': T.MicroMedium,
    'micro-overline': T.MicroOverline,
    tiny: T.Tiny,
    'tiny-overline': T.TinyOverline,
  };

  it.each(Object.entries(namedComponents))('%s component applies its variant', (variant, Text) => {
    render(<Text>{text}</Text>);
    expect(screen.getByText(text)).toHaveClass('typography', variant);
  });

  it('renders the semantic default tag and accepts overrides', () => {
    render(
      <>
        <T.Heading1>Title</T.Heading1>
        <T.Heading1 tag="h2">Subtitle</T.Heading1>
      </>,
    );
    expect(screen.getByText('Title').tagName).toBe('H1');
    const sub = screen.getByText('Subtitle');
    expect(sub.tagName).toBe('H2');
    expect(sub).toHaveClass('heading-1');
  });

  it('passes native props through', () => {
    render(
      <T.Label tag="label" htmlFor="email">
        Email
      </T.Label>,
    );
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
  });

  it('sets a readable displayName', () => {
    expect(T.Heading1.displayName).toBe('Heading1');
    expect(T.BodySmStrong.displayName).toBe('BodySmStrong');
  });
});
