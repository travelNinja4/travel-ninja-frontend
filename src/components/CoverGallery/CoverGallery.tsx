/**
 * The "Cover & gallery" card of the tour form: one cover image and a gallery
 * of up to 10 photos. Picked files are previewed locally; images the tour
 * already has (when editing) show from their URL.
 *
 * The cover box is the picker itself: click it, press Enter / Space on it, or
 * drop an image on it. Once chosen it shows the image with Replace and Remove.
 * The gallery shows a thumbnail per photo, each with a remove button, and an
 * "Add photo" tile that takes several files at once (or a drop) until it's full.
 * Files of the wrong type or over 5 MB are turned away with a message straight
 * away, so only usable images reach the form.
 *
 * Render the card inside a react-hook-form `FormProvider`; the files live in
 * the parent form's `coverImage` and `gallery` fields (see `coverGallerySchema`).
 *
 * @example
 * ```tsx
 * import { FormProvider, useForm } from 'react-hook-form'
 * import CoverGallery from '@/components/CoverGallery'
 *
 * export default function TourForm() {
 *   const methods = useForm<TourMedia>({ defaultValues: { coverImage: null, gallery: [] } });
 *   return (
 *     <FormProvider {...methods}>
 *       <form noValidate onSubmit={methods.handleSubmit(saveTour)}>
 *         <CoverGallery />
 *       </form>
 *     </FormProvider>
 *   );
 * }
 * ```
 */
'use client';

import { ChangeEvent, DragEvent, useEffect, useId, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { ImagePlus, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { COVER_GALLERY } from '@/constants/strings';
import type { TourImage, TourMedia } from '@/constants/types';
import Typography from '../Typography';
import Button from '../Button';
import Image from '../Image';
import { IMAGE_TYPES, MAX_GALLERY_PHOTOS, imageError } from './CoverGallerySchema';
import styles from './CoverGallery.module.scss';

const ACCEPT = IMAGE_TYPES.join(',');

/**
 * A URL for previewing `image`: its own for a saved image, or a local one for a
 * picked file, released when the file changes or the preview unmounts
 */
export function usePreviewUrl(image: TourImage | null) {
  const file = image instanceof File ? image : null;
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is an external resource; creating it here pairs it with the revoke below, so Strict Mode's remount can't leave a revoked URL
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(undefined);
    };
  }, [file]);

  return image instanceof File ? url : image?.url;
}

/** Drag-and-drop handlers for a drop target, and whether files are being dragged over it */
export function useFileDrop(onFiles: (files: FileList) => void, disabled: boolean) {
  const [isDragging, setIsDragging] = useState(false);

  const allowDrop = (event: DragEvent) => {
    if (disabled) return;
    event.preventDefault();
    setIsDragging(true);
  };

  return {
    isDragging,
    dropProps: {
      onDragOver: allowDrop,
      onDragEnter: allowDrop,
      onDragLeave: () => setIsDragging(false),
      onDrop: (event: DragEvent) => {
        if (disabled) return;
        event.preventDefault();
        setIsDragging(false);
        onFiles(event.dataTransfer.files);
      },
    },
  };
}

// Picked files have no id, so give each image a stable key the first time it renders
const imageKeys = new WeakMap<TourImage, number>();
let nextImageKey = 0;
const keyOf = (image: TourImage) => {
  if (!imageKeys.has(image)) imageKeys.set(image, nextImageKey++);
  return imageKeys.get(image)!;
};

interface PhotoProps {
  image: TourImage;
  index: number;
  disabled: boolean;
  onRemove: (index: number) => void;
}

/** One gallery thumbnail. Keyed by image, so adding or removing a photo keeps the others' previews. */
function Photo({ image, index, disabled, onRemove }: PhotoProps) {
  const url = usePreviewUrl(image);
  const label = `${COVER_GALLERY.PHOTO} ${index + 1}`;

  return (
    <li className={styles.tile}>
      {url && (
        <Image src={url} alt={label} fill unoptimized sizes="12rem" className={styles.preview} />
      )}
      <button
        type="button"
        className={styles.removePhoto}
        aria-label={`${COVER_GALLERY.REMOVE_PHOTO} ${index + 1}`}
        disabled={disabled}
        onClick={() => onRemove(index)}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </li>
  );
}

/** Hint below a field, swapped for the error when there is one */
function FieldMessage({ id, hint, error }: { id: string; hint: string; error?: string }) {
  return (
    <Typography
      variant="caption"
      tag="p"
      id={id}
      role={error ? 'alert' : undefined}
      className={clsx(styles.message, error && styles.error)}
    >
      {error ?? hint}
    </Typography>
  );
}

/**
 * Define the props available for the CoverGallery component.
 */
export interface CoverGalleryProps {
  /**
   * Disables picking, replacing and removing images, e.g. while the form submits.
   *
   * @default false
   */
  disabled?: boolean;

  className?: string;
}

export default function CoverGallery({ disabled = false, className }: CoverGalleryProps) {
  const titleId = useId();
  const coverLabelId = useId();
  const coverMessageId = useId();
  const galleryLabelId = useId();
  const galleryMessageId = useId();
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const { control } = useFormContext<TourMedia>();
  const cover = useController({ control, name: 'coverImage' });
  const gallery = useController({ control, name: 'gallery' });
  const photos = gallery.field.value ?? [];
  const coverUrl = usePreviewUrl(cover.field.value);

  // Files turned away when picked; the form's own errors show otherwise
  const [coverRejection, setCoverRejection] = useState<string>();
  const [galleryRejection, setGalleryRejection] = useState<string>();

  const pickCover = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const error = imageError(file);
    setCoverRejection(error);
    if (!error) cover.field.onChange(file);
  };

  const addPhotos = (files: FileList | null) => {
    const picked = Array.from(files ?? []);
    if (picked.length === 0) return;
    const usable = picked.filter((file) => !imageError(file));
    const room = MAX_GALLERY_PHOTOS - photos.length;
    const firstError = picked.map(imageError).find(Boolean);
    setGalleryRejection(
      firstError ?? (usable.length > room ? COVER_GALLERY.GALLERY_FULL : undefined),
    );
    if (usable.length > 0 && room > 0)
      gallery.field.onChange([...photos, ...usable.slice(0, room)]);
  };

  const removePhoto = (index: number) => {
    setGalleryRejection(undefined);
    gallery.field.onChange(photos.filter((_, i) => i !== index));
  };

  const removeCover = () => {
    setCoverRejection(undefined);
    cover.field.onChange(null);
  };

  // Cleared afterwards so picking the same file again still fires a change
  const onInputChange =
    (handle: (files: FileList | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      handle(event.target.files);
      event.target.value = '';
    };

  const coverDrop = useFileDrop(pickCover, disabled);
  const galleryDrop = useFileDrop(addPhotos, disabled);

  const coverError = coverRejection ?? cover.fieldState.error?.message;
  const galleryError = galleryRejection ?? gallery.fieldState.error?.message;
  const isGalleryFull = photos.length >= MAX_GALLERY_PHOTOS;

  return (
    <section
      data-testid="CoverGalleryTest"
      aria-labelledby={titleId}
      className={clsx(styles.card, className)}
    >
      <Typography variant="title-md" tag="h2" id={titleId} className={styles.header}>
        {COVER_GALLERY.TITLE}
      </Typography>

      <div className={styles.body}>
        <div className={styles.group}>
          <Typography variant="label" tag="h3" id={coverLabelId} className={styles.label}>
            {COVER_GALLERY.COVER}
          </Typography>

          <input
            ref={coverInput}
            type="file"
            accept={ACCEPT}
            hidden
            data-testid="CoverImageInput"
            onChange={onInputChange(pickCover)}
          />

          {cover.field.value ? (
            <div className={styles.cover} {...coverDrop.dropProps}>
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={COVER_GALLERY.COVER_PREVIEW}
                  fill
                  unoptimized
                  sizes="(min-width: 40rem) 36rem, 100vw"
                  className={styles.preview}
                />
              )}
              <div className={styles.coverActions}>
                <Button
                  variant="secondary"
                  className={styles.coverAction}
                  disabled={disabled}
                  onClick={() => coverInput.current?.click()}
                >
                  {COVER_GALLERY.REPLACE}
                </Button>
                <Button
                  variant="secondary"
                  className={styles.coverAction}
                  disabled={disabled}
                  onClick={removeCover}
                >
                  {COVER_GALLERY.REMOVE}
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={clsx(styles.coverDropzone, styles.dropzone, {
                [styles.dragging]: coverDrop.isDragging,
                [styles.invalid]: !!coverError,
              })}
              aria-labelledby={coverLabelId}
              aria-describedby={coverMessageId}
              disabled={disabled}
              onClick={() => coverInput.current?.click()}
              {...coverDrop.dropProps}
            >
              <span className={styles.dropIcon}>
                <ImagePlus size={22} aria-hidden="true" />
              </span>
              <Typography variant="title-sm" tag="span" className={styles.dropTitle}>
                {COVER_GALLERY.COVER_PROMPT}
              </Typography>
              <Typography variant="caption" tag="span" className={styles.message}>
                {COVER_GALLERY.DROP_HINT}
              </Typography>
            </button>
          )}

          <FieldMessage id={coverMessageId} hint={COVER_GALLERY.COVER_HINT} error={coverError} />
        </div>

        <div className={styles.group}>
          <div className={styles.labelRow}>
            <Typography variant="label" tag="h3" id={galleryLabelId} className={styles.label}>
              {COVER_GALLERY.GALLERY}
            </Typography>
            <Typography variant="caption" className={styles.message}>
              {photos.length} / {MAX_GALLERY_PHOTOS}
            </Typography>
          </div>

          <input
            ref={galleryInput}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            data-testid="GalleryInput"
            onChange={onInputChange(addPhotos)}
          />

          <ul className={styles.grid} aria-labelledby={galleryLabelId}>
            {photos.map((image, index) => (
              <Photo
                key={keyOf(image)}
                image={image}
                index={index}
                disabled={disabled}
                onRemove={removePhoto}
              />
            ))}

            {!isGalleryFull && (
              <li className={styles.tile}>
                <button
                  type="button"
                  className={clsx(styles.dropzone, styles.addPhoto, {
                    [styles.dragging]: galleryDrop.isDragging,
                  })}
                  aria-describedby={galleryMessageId}
                  disabled={disabled}
                  onClick={() => galleryInput.current?.click()}
                  {...galleryDrop.dropProps}
                >
                  <Plus size={20} aria-hidden="true" />
                  <Typography variant="title-sm" tag="span" className={styles.dropTitle}>
                    {COVER_GALLERY.ADD_PHOTO}
                  </Typography>
                </button>
              </li>
            )}
          </ul>

          <FieldMessage
            id={galleryMessageId}
            hint={COVER_GALLERY.GALLERY_HINT}
            error={galleryError}
          />
        </div>
      </div>
    </section>
  );
}
