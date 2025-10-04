/**
 * A flexible, reusable image component built on top of Next.js Image, with built-in fallback, responsive handling, and accessibility checks to ensure optimized and consistent image rendering across the application.
 *
 * @example
 * ```tsx
 * import CustomImage from '@src/components/CustomImage'
 *
 * export default function CustomImage() {
 *   return <CustomImage
 *             src="https://picsum.photos/400/250"
 *             alt="Random placeholder"
 *             isUrl width={400}
 *             height={250}
 *       />;
 *  }
 * ```
 */
'use client';

import Image from 'next/image';
import { IMAGES } from '@/constants/images';
import type { ImageProps } from 'next/image';
import { buildCloudinaryUrl } from '@/utils/imageHelper';
import styles from './CustomImage.module.scss';

/**
 * Define the props available for the CustomImage component.
 */
interface CustomImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /**
   * The source of the image.
   *
   * If `isUrl` is `true`, this should be a direct image URL.
   * If `isUrl` is `false`, this should be a key from the `IMAGES` constant.
   * If empty/invalid, the fallback image will be used.
   */
  src: string;

  /**
   *
   */
  alt: string;

  /**
   * The width of the image (in pixels).
   * Ignored if `fill` is set to `true`.
   *
   * @default 200
   */
  width?: number;

  /**
   * The height of the image (in pixels).
   * Ignored if `fill` is set to `true`.
   *
   * @default 200
   */
  height?: number;

  /**
   * If `true`, the image will stretch to fill its parent container
   * while maintaining aspect ratio.
   *
   * @default false
   */
  fill?: boolean;

  /**
   * Inline styles applied to the image container.
   */
  style?: object;

  /**
   * Optional CSS class name for applying custom styles.
   */
  className?: string;

  /**
   * Defines the loading behavior of the image.
   *
   * `lazy`: Image loads only when visible on the viewport (default).
   * `eager`: Image loads immediately, regardless of visibility.
   *
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager';

  /**
   * If `true`, the image is considered high priority and will preload.
   * Useful for above-the-fold images like banners or logos.
   *
   * @default false
   */
  priority?: boolean;

  /**
   * Whether the `src` provided is a full URL or a key from `IMAGES`.
   *
   * `true`: Treats `src` as a valid URL.
   * `false`: Maps `src` to an entry in the `IMAGES` constant.
   *
   * @default false
   */
  isUrl?: boolean;
}

export default function CustomImage({
  src,
  alt,
  width = 200,
  height = 200,
  fill = false,
  style = {},
  className,
  loading = 'lazy',
  priority = false,
  isUrl = false,
  ...rest
}: CustomImageProps) {
  const resolvedSrc = (() => {
    if (!src) return buildCloudinaryUrl(IMAGES.FALLBACK_IMG);
    if (isUrl) return src;
    const mappedSrc = IMAGES[src as keyof typeof IMAGES];
    return mappedSrc ? buildCloudinaryUrl(mappedSrc) : buildCloudinaryUrl(IMAGES.FALLBACK_IMG);
  })();

  return (
    <Image
      data-testid="CustomImageTest"
      src={resolvedSrc}
      alt={alt}
      {...(!fill && { width, height })}
      {...(fill && { fill })}
      style={style}
      className={className}
      {...(!priority && { loading })}
      priority={priority}
      placeholder="blur"
      blurDataURL={buildCloudinaryUrl(IMAGES.FALLBACK_IMG)}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = buildCloudinaryUrl(IMAGES.FALLBACK_IMG);
      }}
      {...rest}
    />
  );
}
