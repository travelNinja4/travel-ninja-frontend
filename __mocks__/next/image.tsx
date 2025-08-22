import * as React from 'react';
import type { ImgHTMLAttributes } from 'react';

interface MockImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

// Simple mock: Next.js <Image> behaves like a normal <img>
const NextImage = ({ src, alt, ...props }: MockImageProps) => {
  return <img src={src} alt={alt} {...props} />;
};

export default NextImage;
