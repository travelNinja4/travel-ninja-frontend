/**
 * Thin wrapper around `next/image` that swaps in a local placeholder when the
 * source is missing or fails to load, so a broken URL never shows the
 * browser's broken-image icon.
 *
 * Takes everything `next/image` takes: a local path from `/public`, a remote
 * URL (its host must be listed in `images.remotePatterns` in next.config.ts),
 * or a static import.
 *
 * @example
 * ```tsx
 * import Image from '@/components/Image'
 * import heroImg from '@/assets/hero.jpg'
 *
 * export default function TourCard({ tour }) {
 *   return (
 *     <>
 *       <Image src={heroImg} alt="Goa beach at sunset" preload />
 *       <Image src={tour.coverUrl} alt={tour.name} width={320} height={200} />
 *       <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
 *         <Image src={tour.coverUrl} alt={tour.name} fill sizes="(max-width: 768px) 100vw, 50vw" />
 *       </div>
 *     </>
 *   );
 * }
 * ```
 */
'use client';

import { useState } from 'react';
import NextImage, { type ImageProps as NextImageProps } from 'next/image';

/** Placeholder shown when `src` is empty or fails to load. Lives in /public. */
export const FALLBACK_IMAGE_SRC = '/images/fallback.svg';

/**
 * Define the props available for the Image component.
 * Every other `next/image` prop (`fill`, `sizes`, `preload`, `quality`, ...) is passed through.
 */
export interface ImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  /**
   * Local path, remote URL or static import. When empty or when it fails to
   * load, `fallbackSrc` is shown instead.
   */
  src?: NextImageProps['src'] | null;

  /**
   * Describes the image for screen readers. Pass `""` for purely decorative images.
   */
  alt: string;

  /**
   * Image shown when `src` is missing or broken.
   *
   * @default '/images/fallback.svg'
   */
  fallbackSrc?: NextImageProps['src'];
}

export default function Image({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE_SRC,
  onError,
  ...rest
}: ImageProps) {
  // Remember which src failed, so a new src automatically gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<ImageProps['src']>(null);
  const showFallback = !src || failedSrc === src;

  return (
    <NextImage
      data-testid="ImageTest"
      {...rest}
      src={showFallback ? fallbackSrc : src}
      alt={alt}
      onError={(event) => {
        // Stop at the fallback, so a broken fallback can't loop
        if (!showFallback) setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
