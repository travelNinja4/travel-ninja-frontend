import { render, screen, fireEvent } from '@testing-library/react';
import Image, { FALLBACK_IMAGE_SRC } from './Image';

describe('Image', () => {
  /** Base props for Image (alt is passed explicitly so jsx-a11y/alt-text can see it) **/
  const alt = 'Goa beach at sunset';
  const baseProps = {
    src: 'https://picsum.photos/300/200',
    width: 300,
    height: 200,
  };

  const getImage = () => screen.getByTestId('ImageTest') as HTMLImageElement;

  /**
   * @test
   * Renders the Image component without throwing an error
   * and checks if the ImageTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<Image {...baseProps} alt={alt} />);
    expect(screen.getByRole('img', { name: alt })).toBe(getImage());
  });

  it('renders a remote URL', () => {
    render(<Image {...baseProps} alt={alt} unoptimized />);
    expect(getImage()).toHaveAttribute('src', baseProps.src);
  });

  it('renders a local path from /public', () => {
    render(<Image {...baseProps} alt={alt} src="/images/logo.png" unoptimized />);
    expect(getImage()).toHaveAttribute('src', '/images/logo.png');
  });

  it.each([
    ['empty string', ''],
    ['null', null],
    ['undefined', undefined],
  ])('shows the fallback when src is %s', (_, src) => {
    render(<Image {...baseProps} alt={alt} src={src} />);
    expect(getImage()).toHaveAttribute('src', FALLBACK_IMAGE_SRC);
  });

  it('switches to the fallback when the image fails to load', () => {
    render(<Image {...baseProps} alt={alt} unoptimized />);
    fireEvent.error(getImage());
    expect(getImage()).toHaveAttribute('src', FALLBACK_IMAGE_SRC);
  });

  it('uses a custom fallbackSrc', () => {
    render(<Image {...baseProps} alt={alt} unoptimized fallbackSrc="/images/avatar.svg" />);
    fireEvent.error(getImage());
    expect(getImage()).toHaveAttribute('src', '/images/avatar.svg');
  });

  it('still calls the onError prop', () => {
    const onError = vi.fn();
    render(<Image {...baseProps} alt={alt} unoptimized onError={onError} />);
    fireEvent.error(getImage());
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('does not loop when the fallback also fails', () => {
    const onError = vi.fn();
    render(<Image {...baseProps} alt={alt} src="" onError={onError} />);
    fireEvent.error(getImage());
    fireEvent.error(getImage());
    expect(getImage()).toHaveAttribute('src', FALLBACK_IMAGE_SRC);
    expect(onError).toHaveBeenCalledTimes(2);
  });

  it('tries again when src changes after an error', () => {
    const { rerender } = render(<Image {...baseProps} alt={alt} unoptimized />);
    fireEvent.error(getImage());
    expect(getImage()).toHaveAttribute('src', FALLBACK_IMAGE_SRC);

    rerender(<Image {...baseProps} alt={alt} src="https://picsum.photos/400/300" unoptimized />);
    expect(getImage()).toHaveAttribute('src', 'https://picsum.photos/400/300');
  });

  it('passes next/image props through', () => {
    render(<Image {...baseProps} alt={alt} className="cover" loading="eager" />);
    expect(getImage()).toHaveClass('cover');
    expect(getImage()).toHaveAttribute('width', '300');
    expect(getImage()).toHaveAttribute('height', '200');
    expect(getImage()).toHaveAttribute('loading', 'eager');
  });

  it('allows an empty alt for decorative images', () => {
    render(<Image {...baseProps} alt="" />);
    expect(getImage()).toHaveAttribute('alt', '');
  });
});
