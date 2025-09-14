/**
 * Provides helper functions for working with images
 *
 */

export const buildCloudinaryUrl = (imageName: string) =>
  `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${imageName}`;
