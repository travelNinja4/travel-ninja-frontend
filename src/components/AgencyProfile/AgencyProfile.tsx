/**
 * The agency profile screen: the public identity guests see when browsing the
 * agency's tours, plus its contact details and address.
 *
 *   header           title, description and Save changes
 *   welcome banner   how much of the profile is filled in (name, tagline,
 *                    description, destinations, logo, banner)
 *   Identity         logo, banner, name, tagline, description, destinations
 *   Contact & address
 *   preview          AgencyPreviewCard, live from the fields; its "Add"
 *                    prompts focus the matching empty field
 *
 * No field is mandatory, so a half-done profile can still be saved and finished
 * later. Email and phone come from the registration and are read-only.
 *
 * States come in as a prop; a state's districts load through `getDistricts`
 * once it is picked (and on load for a saved state).
 *
 *   tablet   cards stacked, the preview below them, contact fields two to a row
 *   desktop+ cards on the left, the preview in a side column
 *
 * @example
 * ```tsx
 * import AgencyProfile from '@/components/AgencyProfile'
 *
 * export default async function AgencyProfilePage() {
 *   const states = await commonService.getStates();
 *   return (
 *     <AgencyProfile
 *       profile={{ name: 'Wanderly Travels' }}
 *       states={states}
 *       getDistricts={getDistrictsAction}
 *       onSave={saveProfile}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { ChangeEvent, useEffect, useId, useMemo, useRef, useState, useTransition } from 'react';
import { FormProvider, useController, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Star, Upload } from 'lucide-react';
import clsx from 'clsx';
import { AGENCY_PROFILE } from '@/constants/strings';
import { getInitials, splitPhone } from '@/utils/format';
import type { ActionResult, AgencyProfileValues, Region } from '@/constants/types';
import Typography, { Caption } from '../Typography';
import Button from '../Button';
import PageHeader from '../PageHeader';
import AgencyPreviewCard from '../AgencyPreviewCard';
import Image from '../Image';
import InputField from '../InputField';
import TextArea from '../TextArea';
import DynamicForm from '../DynamicForm';
import { FieldConfig, FieldWidth } from '../DynamicForm/DynamicForm';
import { DropdownOption } from '../Dropdown/Dropdown';
import { useFileDrop, usePreviewUrl } from '../CoverGallery/CoverGallery';
import { IMAGE_TYPES, imageError } from '../CoverGallery/CoverGallerySchema';
import {
  DESCRIPTION_MAX,
  DESTINATIONS_MAX,
  TAGLINE_MAX,
  agencyProfileSchema,
} from './AgencyProfileSchema';
import styles from './AgencyProfile.module.scss';

const ACCEPT = IMAGE_TYPES.join(',');

const DEFAULT_VALUES: AgencyProfileValues = {
  logo: null,
  banner: null,
  name: '',
  tagline: '',
  description: '',
  destinations: '',
  email: '',
  phone: '',
  website: '',
  street: '',
  state: '',
  district: '',
  city: '',
  pin: '',
};

const toOptions = (regions: Region[]): DropdownOption<string>[] =>
  regions.map(({ id, name }) => ({ value: String(id), label: name }));

/**
 * Define the props available for the AgencyProfile component.
 */
export interface AgencyProfileProps {
  /**
   * The saved profile. Missing fields start empty.
   */
  profile?: Partial<AgencyProfileValues>;

  /**
   * States for the State field.
   */
  states: Region[];

  /**
   * Loads a state's districts for the District field, e.g. `getDistrictsAction`.
   * Called when a state is picked, and on load for a saved state.
   */
  getDistricts: (stateId: number) => Promise<ActionResult<Region[]>>;

  /**
   * Called with the valid form values. The fields and button are disabled
   * until the returned promise settles.
   */
  onSave?: (values: AgencyProfileValues) => void | Promise<void>;
}

export default function AgencyProfile({
  profile,
  states,
  getDistricts,
  onSave,
}: AgencyProfileProps) {
  const identityTitleId = useId();
  const contactTitleId = useId();
  const bannerLabelId = useId();
  const bannerMessageId = useId();
  const logoInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  // The mobile number field shows the dial code apart, so it holds just the number
  const phone = splitPhone(profile?.phone ?? '');
  const methods = useForm<AgencyProfileValues>({
    resolver: zodResolver(agencyProfileSchema),
    defaultValues: { ...DEFAULT_VALUES, ...profile, phone: phone.number },
  });
  const {
    control,
    register,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const logo = useController({ control, name: 'logo' });
  const banner = useController({ control, name: 'banner' });
  const [name, tagline, description, destinations] = useWatch({
    control,
    name: ['name', 'tagline', 'description', 'destinations'],
  });
  const logoUrl = usePreviewUrl(logo.field.value);
  const bannerUrl = usePreviewUrl(banner.field.value);

  // Files turned away when picked; the form's own errors show otherwise
  const [logoRejection, setLogoRejection] = useState<string>();
  const [bannerRejection, setBannerRejection] = useState<string>();

  const pickImage =
    (onChange: (file: File) => void, reject: (error?: string) => void) =>
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const error = imageError(file);
      reject(error);
      if (!error) onChange(file);
    };
  const pickLogo = pickImage(logo.field.onChange, setLogoRejection);
  const pickBanner = pickImage(banner.field.onChange, setBannerRejection);
  const bannerDrop = useFileDrop(pickBanner, isSubmitting);

  // Cleared afterwards so picking the same file again still fires a change
  const onInputChange =
    (handle: (files: FileList | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      handle(event.target.files);
      event.target.value = '';
    };

  const stateId = useWatch({ control, name: 'state' });
  const stateOptions = useMemo(() => toOptions(states), [states]);
  const [districtOptions, setDistrictOptions] = useState<DropdownOption<string>[]>([]);
  const [districtsError, setDistrictsError] = useState<string>();
  const [isLoadingDistricts, startLoadingDistricts] = useTransition();
  // The state whose districts were asked for last, so a slower earlier reply can't overwrite them
  const districtsFor = useRef(getValues('state'));

  const fetchDistricts = (stateId: string) =>
    startLoadingDistricts(async () => {
      const result = await getDistricts(Number(stateId));
      if (districtsFor.current !== stateId) return;
      startLoadingDistricts(() => {
        setDistrictOptions(result.success ? toOptions(result.data) : []);
        setDistrictsError(result.success ? undefined : result.errors[0]);
      });
    });

  // A saved state's districts, so its saved district shows by name
  useEffect(() => {
    if (districtsFor.current) fetchDistricts(districtsFor.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only for the state the form opened with
  }, []);

  // A new state's districts replace the old ones, so its district starts empty
  const onStateChange = () => {
    const picked = getValues('state');
    setValue('district', '');
    districtsFor.current = picked;
    setDistrictOptions([]);
    setDistrictsError(undefined);
    fetchDistricts(picked);
  };

  const nameFields: FieldConfig[] = [
    {
      name: 'name',
      label: AGENCY_PROFILE.AGENCY_NAME,
      type: 'input',
      maxLength: 100,
      autoComplete: 'organization',
      disabled: isSubmitting,
    },
  ];

  const destinationFields: FieldConfig[] = [
    {
      name: 'destinations',
      label: AGENCY_PROFILE.DESTINATIONS,
      type: 'input',
      maxLength: DESTINATIONS_MAX,
      placeholder: AGENCY_PROFILE.DESTINATIONS_PLACEHOLDER,
      disabled: isSubmitting,
    },
  ];

  // Phone: one per row. Tablet+: email + phone, website, street, state + district, city + PIN
  const contactFields: FieldConfig[] = [
    {
      name: 'email',
      label: AGENCY_PROFILE.EMAIL,
      type: 'email',
      readOnly: true,
      helperText: AGENCY_PROFILE.FROM_REGISTRATION,
      width: FieldWidth.HALF,
    },
    {
      name: 'phone',
      label: AGENCY_PROFILE.MOBILE_NUMBER,
      type: 'MobileNumberInput',
      dialCode: phone.dialCode,
      readOnly: true,
      helperText: AGENCY_PROFILE.FROM_REGISTRATION,
      width: FieldWidth.HALF,
    },
    {
      name: 'website',
      label: AGENCY_PROFILE.WEBSITE,
      type: 'url',
      maxLength: 255,
      autoComplete: 'url',
      disabled: isSubmitting,
    },
    {
      name: 'street',
      label: AGENCY_PROFILE.ADDRESS,
      type: 'input',
      maxLength: 200,
      autoComplete: 'street-address',
      disabled: isSubmitting,
    },
    {
      name: 'state',
      label: AGENCY_PROFILE.STATE,
      type: 'select',
      placeholder: AGENCY_PROFILE.STATE_PLACEHOLDER,
      options: stateOptions,
      width: FieldWidth.HALF,
      disabled: isSubmitting,
      onValueChange: onStateChange,
    },
    {
      name: 'district',
      label: AGENCY_PROFILE.DISTRICT,
      type: 'select',
      placeholder: stateId ? AGENCY_PROFILE.DISTRICT_PLACEHOLDER : AGENCY_PROFILE.PICK_STATE_FIRST,
      options: districtOptions,
      isLoading: isLoadingDistricts,
      error: districtsError,
      width: FieldWidth.HALF,
      disabled: isSubmitting || !stateId,
    },
    {
      name: 'city',
      label: AGENCY_PROFILE.CITY,
      type: 'input',
      maxLength: 50,
      autoComplete: 'address-level2',
      width: FieldWidth.HALF,
      disabled: isSubmitting,
    },
    {
      name: 'pin',
      label: AGENCY_PROFILE.PIN,
      type: 'input',
      inputMode: 'numeric',
      autoComplete: 'postal-code',
      width: FieldWidth.HALF,
      disabled: isSubmitting,
    },
  ];

  const checklist = [
    name.trim(),
    tagline.trim(),
    description.trim(),
    destinations.trim(),
    logo.field.value,
    banner.field.value,
  ];
  const done = checklist.filter(Boolean).length;
  const percent = Math.round((done / checklist.length) * 100);

  const logoError = logoRejection ?? logo.fieldState.error?.message;
  const bannerError = bannerRejection ?? banner.fieldState.error?.message;
  const initials = getInitials(name);

  return (
    // DynamicForm's fields join this form through the provider, so its schema validates them all
    <FormProvider {...methods}>
      <form
        data-testid="AgencyProfileTest"
        noValidate
        className={styles.page}
        onSubmit={handleSubmit((values) => onSave?.(values))}
      >
        <PageHeader
          title={AGENCY_PROFILE.TITLE}
          description={AGENCY_PROFILE.DESCRIPTION}
          actions={
            <Button type="submit" className={styles.save} disabled={isSubmitting}>
              {AGENCY_PROFILE.SAVE}
            </Button>
          }
        />

        <section className={styles.welcome} aria-label={AGENCY_PROFILE.WELCOME}>
          <span className={styles.welcomeIcon} aria-hidden="true">
            <Star size={18} />
          </span>
          <div className={styles.welcomeText}>
            <Typography variant="title-md" tag="h2">
              {AGENCY_PROFILE.WELCOME}
              {name.trim() && `, ${name.trim()}`}
            </Typography>
            <Typography variant="body-sm" className={styles.muted}>
              {AGENCY_PROFILE.WELCOME_HINT}
            </Typography>
          </div>
          <div className={styles.progress}>
            <div className={styles.progressLabel}>
              <Typography variant="body-sm-strong" tag="span">
                {AGENCY_PROFILE.PROFILE} {percent}% {AGENCY_PROFILE.COMPLETE}
              </Typography>
              <Caption className={styles.muted}>
                {done} {AGENCY_PROFILE.OF} {checklist.length}
              </Caption>
            </div>
            <div
              role="progressbar"
              aria-label={`${AGENCY_PROFILE.PROFILE} ${AGENCY_PROFILE.COMPLETE}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className={styles.track}
            >
              <span className={styles.fill} style={{ width: `${percent}%` }} />
            </div>
          </div>
        </section>

        <div className={styles.layout}>
          <div className={styles.main}>
            <section aria-labelledby={identityTitleId} className={styles.card}>
              <div className={styles.cardHeader}>
                <Typography variant="title-md" tag="h2" id={identityTitleId}>
                  {AGENCY_PROFILE.IDENTITY}
                </Typography>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.group}>
                  <Typography variant="label" tag="h3">
                    {AGENCY_PROFILE.LOGO}
                  </Typography>
                  <input
                    ref={logoInput}
                    type="file"
                    accept={ACCEPT}
                    hidden
                    data-testid="LogoInput"
                    onChange={onInputChange(pickLogo)}
                  />
                  <div className={styles.logoRow}>
                    <div className={styles.logo}>
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={AGENCY_PROFILE.LOGO_PREVIEW}
                          fill
                          unoptimized
                          sizes="6rem"
                          className={styles.cover}
                        />
                      ) : (
                        <span aria-hidden="true">{initials}</span>
                      )}
                    </div>
                    <div className={styles.logoActions}>
                      <div className={styles.buttons}>
                        <Button
                          variant="secondary"
                          startIcon={Upload}
                          iconSize={16}
                          disabled={isSubmitting}
                          onClick={() => logoInput.current?.click()}
                        >
                          {logo.field.value
                            ? AGENCY_PROFILE.REPLACE_LOGO
                            : AGENCY_PROFILE.UPLOAD_LOGO}
                        </Button>
                        {logo.field.value && (
                          <Button
                            variant="secondary"
                            disabled={isSubmitting}
                            onClick={() => {
                              setLogoRejection(undefined);
                              logo.field.onChange(null);
                            }}
                          >
                            {AGENCY_PROFILE.REMOVE}
                          </Button>
                        )}
                      </div>
                      <Caption
                        tag="p"
                        role={logoError ? 'alert' : undefined}
                        className={logoError ? styles.error : styles.muted}
                      >
                        {logoError ??
                          (logo.field.value
                            ? AGENCY_PROFILE.LOGO_SET_HINT
                            : AGENCY_PROFILE.LOGO_HINT)}
                      </Caption>
                    </div>
                  </div>
                </div>

                <div className={styles.group}>
                  <Typography variant="label" tag="h3" id={bannerLabelId}>
                    {AGENCY_PROFILE.BANNER}{' '}
                    <span className={styles.muted}>{AGENCY_PROFILE.OPTIONAL}</span>
                  </Typography>
                  <input
                    ref={bannerInput}
                    type="file"
                    accept={ACCEPT}
                    hidden
                    data-testid="BannerInput"
                    onChange={onInputChange(pickBanner)}
                  />
                  {banner.field.value ? (
                    <div className={styles.banner} {...bannerDrop.dropProps}>
                      {bannerUrl && (
                        <Image
                          src={bannerUrl}
                          alt={AGENCY_PROFILE.BANNER_PREVIEW}
                          fill
                          unoptimized
                          sizes="(min-width: 64rem) 60rem, 100vw"
                          className={styles.cover}
                        />
                      )}
                      <div className={styles.bannerActions}>
                        <Button
                          variant="secondary"
                          disabled={isSubmitting}
                          onClick={() => bannerInput.current?.click()}
                        >
                          {AGENCY_PROFILE.REPLACE}
                        </Button>
                        <Button
                          variant="secondary"
                          disabled={isSubmitting}
                          onClick={() => {
                            setBannerRejection(undefined);
                            banner.field.onChange(null);
                          }}
                        >
                          {AGENCY_PROFILE.REMOVE}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={clsx(styles.dropzone, {
                        [styles.dragging]: bannerDrop.isDragging,
                        [styles.invalid]: !!bannerError,
                      })}
                      aria-labelledby={bannerLabelId}
                      aria-describedby={bannerMessageId}
                      disabled={isSubmitting}
                      onClick={() => bannerInput.current?.click()}
                      {...bannerDrop.dropProps}
                    >
                      <ImageIcon size={22} className={styles.brand} aria-hidden="true" />
                      <Typography variant="body-sm" tag="span">
                        <span className={styles.browse}>{AGENCY_PROFILE.BROWSE}</span>{' '}
                        {AGENCY_PROFILE.BANNER_PROMPT}
                      </Typography>
                      <Caption id={bannerMessageId} className={styles.muted}>
                        {AGENCY_PROFILE.BANNER_HINT}
                      </Caption>
                    </button>
                  )}
                  {bannerError && (
                    <Caption tag="p" role="alert" className={styles.error}>
                      {bannerError}
                    </Caption>
                  )}
                </div>

                <DynamicForm fields={nameFields} />

                <div className={styles.counted}>
                  <InputField
                    label={AGENCY_PROFILE.TAGLINE}
                    maxLength={TAGLINE_MAX}
                    placeholder={AGENCY_PROFILE.TAGLINE_PLACEHOLDER}
                    helperText={AGENCY_PROFILE.TAGLINE_HINT}
                    disabled={isSubmitting}
                    error={errors.tagline?.message}
                    {...register('tagline')}
                  />
                  <Caption className={styles.count} aria-hidden="true">
                    {tagline.length} / {TAGLINE_MAX}
                  </Caption>
                </div>

                <div className={styles.counted}>
                  <TextArea
                    label={AGENCY_PROFILE.DESCRIPTION_LABEL}
                    rows={5}
                    maxLength={DESCRIPTION_MAX}
                    placeholder={AGENCY_PROFILE.DESCRIPTION_PLACEHOLDER}
                    disabled={isSubmitting}
                    error={errors.description?.message}
                    {...register('description')}
                  />
                  <Caption className={styles.count} aria-hidden="true">
                    {description.length} / {DESCRIPTION_MAX}
                  </Caption>
                </div>

                <DynamicForm fields={destinationFields} />
              </div>
            </section>

            <section aria-labelledby={contactTitleId} className={styles.card}>
              <div className={styles.cardHeader}>
                <Typography variant="title-md" tag="h2" id={contactTitleId}>
                  {AGENCY_PROFILE.CONTACT}
                </Typography>
              </div>

              <DynamicForm
                fields={contactFields}
                className={clsx(styles.cardBody, styles.contact)}
              />
            </section>
          </div>

          <aside className={styles.aside}>
            <AgencyPreviewCard
              name={name}
              tagline={tagline}
              description={description}
              destinations={destinations}
              logoUrl={logoUrl}
              bannerUrl={bannerUrl}
              onAdd={setFocus}
            />
          </aside>
        </div>
      </form>
    </FormProvider>
  );
}
