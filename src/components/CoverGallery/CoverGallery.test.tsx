import { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { COVER_GALLERY } from '@/constants/strings';
import type { TourMedia } from '@/constants/types';
import CoverGallery from './CoverGallery';
import { coverGallerySchema, MAX_GALLERY_PHOTOS, MAX_IMAGE_BYTES } from './CoverGallerySchema';

describe('CoverGallery', () => {
  // jsdom has no object URLs
  beforeEach(() => {
    let count = 0;
    URL.createObjectURL = vi.fn(() => `blob:preview-${count++}`);
    URL.revokeObjectURL = vi.fn();
  });

  const image = (name = 'photo.jpg', type = 'image/jpeg', size = 1024) =>
    new File([new Uint8Array(size)], name, { type });

  /** The parent form CoverGallery registers on; submitting it reports the values **/
  function Form({
    children,
    defaultValues = { coverImage: null, gallery: [] },
    onSubmit,
  }: {
    children: ReactNode;
    defaultValues?: TourMedia;
    onSubmit: (v: unknown) => void;
  }) {
    const methods = useForm<TourMedia>({
      resolver: zodResolver(coverGallerySchema),
      defaultValues,
    });
    return (
      <FormProvider {...methods}>
        <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
          {children}
          <button type="submit">Save</button>
        </form>
      </FormProvider>
    );
  }

  const setup = (props = {}, defaultValues?: TourMedia) => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={defaultValues} onSubmit={onSubmit}>
        <CoverGallery {...props} />
      </Form>,
    );
    const submit = async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
      return onSubmit.mock.calls[0][0];
    };
    return { submit };
  };

  const pickCover = (...files: File[]) =>
    fireEvent.change(screen.getByTestId('CoverImageInput'), { target: { files } });
  const addPhotos = (...files: File[]) =>
    fireEvent.change(screen.getByTestId('GalleryInput'), { target: { files } });

  it('renders the empty cover drop zone and the Add photo tile', () => {
    setup();
    expect(screen.getByRole('region', { name: COVER_GALLERY.TITLE })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: COVER_GALLERY.COVER })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: COVER_GALLERY.ADD_PHOTO })).toBeInTheDocument();
    expect(screen.getByText(`0 / ${MAX_GALLERY_PHOTOS}`)).toBeInTheDocument();
  });

  it('previews a picked cover and submits it', async () => {
    const { submit } = setup();
    const cover = image('cover.jpg');
    pickCover(cover);
    expect(await screen.findByAltText(COVER_GALLERY.COVER_PREVIEW)).toHaveAttribute(
      'src',
      'blob:preview-0',
    );
    expect(await submit()).toMatchObject({ coverImage: cover });
  });

  it('accepts a cover dropped on the drop zone', async () => {
    setup();
    fireEvent.drop(screen.getByRole('button', { name: COVER_GALLERY.COVER }), {
      dataTransfer: { files: [image()] },
    });
    expect(await screen.findByAltText(COVER_GALLERY.COVER_PREVIEW)).toBeInTheDocument();
  });

  it('removes the cover and releases its preview', async () => {
    const { submit } = setup();
    pickCover(image());
    fireEvent.click(await screen.findByRole('button', { name: COVER_GALLERY.REMOVE }));
    expect(screen.getByRole('button', { name: COVER_GALLERY.COVER })).toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-0');
    expect(await submit()).toMatchObject({ coverImage: null });
  });

  it('turns away a cover of the wrong type or size', () => {
    setup();
    pickCover(image('notes.pdf', 'application/pdf'));
    expect(screen.getByRole('alert')).toHaveTextContent(COVER_GALLERY.INVALID_TYPE);
    pickCover(image('huge.jpg', 'image/jpeg', MAX_IMAGE_BYTES + 1));
    expect(screen.getByRole('alert')).toHaveTextContent(COVER_GALLERY.TOO_LARGE);
    expect(screen.queryByAltText(COVER_GALLERY.COVER_PREVIEW)).not.toBeInTheDocument();
  });

  it('adds several photos at once, keeps the usable ones and submits them in order', async () => {
    const { submit } = setup();
    const first = image('a.jpg');
    const second = image('b.png', 'image/png');
    addPhotos(first, image('c.gif', 'image/gif'), second);
    expect(screen.getAllByAltText(new RegExp(COVER_GALLERY.PHOTO))).toHaveLength(2);
    expect(screen.getByRole('alert')).toHaveTextContent(COVER_GALLERY.INVALID_TYPE);
    expect(await submit()).toMatchObject({ gallery: [first, second] });
  });

  it('removes a photo', async () => {
    const { submit } = setup();
    const kept = image('b.jpg');
    addPhotos(image('a.jpg'), kept);
    fireEvent.click(screen.getByRole('button', { name: `${COVER_GALLERY.REMOVE_PHOTO} 1` }));
    expect(await submit()).toMatchObject({ gallery: [kept] });
  });

  it('stops at the gallery limit and hides Add photo once full', () => {
    setup();
    addPhotos(...Array.from({ length: MAX_GALLERY_PHOTOS + 2 }, (_, i) => image(`${i}.jpg`)));
    expect(screen.getAllByAltText(new RegExp(COVER_GALLERY.PHOTO))).toHaveLength(
      MAX_GALLERY_PHOTOS,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(COVER_GALLERY.GALLERY_FULL);
    expect(screen.queryByRole('button', { name: COVER_GALLERY.ADD_PHOTO })).not.toBeInTheDocument();
  });

  it('shows the tour’s saved images from their URLs and keeps them on submit', async () => {
    const cover = { url: 'https://cdn.example.com/cover.jpg' };
    const saved = { id: 7, url: 'https://cdn.example.com/day-1.jpg' };
    const { submit } = setup({}, { coverImage: cover, gallery: [saved] });
    expect(screen.getByAltText(COVER_GALLERY.COVER_PREVIEW)).toHaveAttribute('src', cover.url);
    expect(screen.getByAltText(`${COVER_GALLERY.PHOTO} 1`)).toHaveAttribute('src', saved.url);
    expect(URL.createObjectURL).not.toHaveBeenCalled();

    const added = image('day-2.jpg');
    addPhotos(added);
    expect(await submit()).toMatchObject({ coverImage: cover, gallery: [saved, added] });
  });

  it('disables every control', () => {
    setup({ disabled: true });
    expect(screen.getByRole('button', { name: COVER_GALLERY.COVER })).toBeDisabled();
    expect(screen.getByRole('button', { name: COVER_GALLERY.ADD_PHOTO })).toBeDisabled();
  });
});
