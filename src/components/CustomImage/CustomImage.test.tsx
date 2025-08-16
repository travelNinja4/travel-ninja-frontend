import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { buildCloudinaryUrl } from '@/utils/imageHelper';
import { IMAGES } from '@/constants/images';
import CustomImage from './CustomImage';

describe('Home', () => {
  /** Base props for CustomImage **/
  const baseProps = {
    src: 'FALLBACK_IMG',
    alt: 'CustomImage Test',
  };

  /**
   * @test
   * Renders the CustomImage component without throwing an error
   * and checks if the CustomImageTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<CustomImage {...baseProps} />);
    expect(screen.getByTestId('CustomImageTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the CustomImage component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<CustomImage {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the CustomImage component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<CustomImage {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('uses fallback image when src is empty', () => {
    render(<CustomImage {...baseProps} src="" />);
    const img = screen.getByTestId('CustomImageTest') as HTMLImageElement;
    expect(img).toHaveAttribute('src', buildCloudinaryUrl(IMAGES.FALLBACK_IMG));
  });

  it('renders direct URL when isUrl is true', () => {
    const url = 'https://example.com/test.jpg';
    render(<CustomImage {...baseProps} src={url} isUrl />);
    const img = screen.getByTestId('CustomImageTest') as HTMLImageElement;
    expect(img).toHaveAttribute('src', url);
  });

  it('uses fallback when src key is not in IMAGES', () => {
    render(<CustomImage {...baseProps} src="INVALID_KEY" />);
    const img = screen.getByTestId('CustomImageTest') as HTMLImageElement;
    expect(img).toHaveAttribute('src', buildCloudinaryUrl(IMAGES.FALLBACK_IMG));
  });

  it('switches to fallback image on error', () => {
    render(<CustomImage {...baseProps} isUrl src="https://broken-url.com/image.png" />);
    const img = screen.getByTestId('CustomImageTest') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toBe(buildCloudinaryUrl(IMAGES.FALLBACK_IMG));
  });
});
