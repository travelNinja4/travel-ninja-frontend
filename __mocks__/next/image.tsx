import * as React from 'react';
import type { ImgHTMLAttributes } from 'react';

interface MockImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

// Props only next/image understands; dropped so React doesn't warn about them on <img>
const NEXT_ONLY_PROPS = new Set([
  'fill',
  'preload',
  'priority',
  'quality',
  'placeholder',
  'blurDataURL',
  'unoptimized',
]);

// Simple mock: Next.js <Image> behaves like a normal <img>
const NextImage = ({ src, alt, ...props }: MockImageProps) => {
  const imgProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !NEXT_ONLY_PROPS.has(key)),
  );
  return <img src={src} alt={alt} {...imgProps} />;
};

export default NextImage;
