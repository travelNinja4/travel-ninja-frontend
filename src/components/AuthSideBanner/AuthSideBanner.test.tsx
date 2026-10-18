import { render, screen } from '@testing-library/react';
import AuthSideBanner from './AuthSideBanner';

describe('AuthSideBanner', () => {
  /** Base props for AuthSideBanner **/
  const baseProps = {
    header: 'Run tours with clarity',
    subText: 'TravelNinja helps Indian tour operators publish departures.',
  };

  /**
   * @test
   * Renders the AuthSideBanner component without throwing an error
   * and checks if the AuthSideBannerTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<AuthSideBanner {...baseProps} />);
    expect(screen.getByTestId('AuthSideBannerTest')).toBeInTheDocument();
  });

  it('renders the header as an h2 so the form keeps the page h1', () => {
    render(<AuthSideBanner {...baseProps} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(baseProps.header);
  });

  it('renders the sub text', () => {
    render(<AuthSideBanner {...baseProps} />);
    expect(screen.getByText(baseProps.subText).tagName).toBe('P');
  });

  it('omits the sub text when not passed', () => {
    render(<AuthSideBanner header={baseProps.header} />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(screen.getByTestId('AuthSideBannerTest').querySelectorAll('p')).toHaveLength(0);
  });

  it('updates when the copy changes, e.g. login → create account', () => {
    const { rerender } = render(<AuthSideBanner {...baseProps} />);
    rerender(<AuthSideBanner header="Grow your tour business" subText="Set up in minutes." />);

    expect(screen.getByRole('heading')).toHaveTextContent('Grow your tour business');
    expect(screen.getByText('Set up in minutes.')).toBeInTheDocument();
    expect(screen.queryByText(baseProps.header)).not.toBeInTheDocument();
  });

  it('accepts React nodes for header and sub text', () => {
    render(
      <AuthSideBanner
        header={
          <>
            Run tours with <em>clarity</em>
          </>
        }
        subText={<strong>Bold copy</strong>}
      />,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Run tours with clarity');
    expect(screen.getByText('Bold copy').tagName).toBe('STRONG');
  });

  it('renders as a complementary landmark and passes native attributes through', () => {
    render(<AuthSideBanner {...baseProps} className="custom" aria-label="About TravelNinja" />);
    const banner = screen.getByRole('complementary', { name: 'About TravelNinja' });
    expect(banner).toHaveClass('custom');
    expect(banner).toHaveClass('banner');
  });

  it('does not render any images', () => {
    render(<AuthSideBanner {...baseProps} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
