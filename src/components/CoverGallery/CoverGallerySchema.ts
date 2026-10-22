import { z } from 'zod';
import { COVER_GALLERY } from '@/constants/strings';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_GALLERY_PHOTOS = 10;

export const imageSchema = z
  .file()
  .mime(IMAGE_TYPES, COVER_GALLERY.INVALID_TYPE)
  .max(MAX_IMAGE_BYTES, COVER_GALLERY.TOO_LARGE);

export const coverGallerySchema = z.object({
  coverImage: imageSchema.nullable(),
  gallery: z.array(imageSchema).max(MAX_GALLERY_PHOTOS, COVER_GALLERY.GALLERY_FULL),
});

/** Why `file` can't be used as a tour image, or undefined when it can */
export const imageError = (file: File) => imageSchema.safeParse(file).error?.issues[0]?.message;
