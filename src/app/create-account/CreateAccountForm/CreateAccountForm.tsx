/**
 * Create-account form: agency and contact details, country, business email,
 * mobile number, password and terms. Validates with `createAccountSchema`,
 * then calls the `registerAction` server action and sends the user to
 * email / mobile verification.
 *
 * The page handles layout (AuthLayout) and fetches the countries.
 */
'use client';

import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerAction } from '@/actions/auth';
import AppLink from '@/components/AppLink';
import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import Dropdown from '@/components/Dropdown';
import InputField from '@/components/InputField';
import MobileNumberInput from '@/components/MobileNumberInput';
import { Body, BodyLg, Heading2 } from '@/components/Typography';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { Country } from '@/constants/types';
import { useNotification } from '@/providers/NotificationProvider';
import { createAccountSchema, type CreateAccountFormValues } from './CreateAccountSchema';
import styles from './CreateAccountForm.module.scss';

/** "+91 (IN)" -> "+91" */
const dialCode = (code: string) => code.split(' ')[0];

interface CreateAccountFormProps {
  /** Countries from the API, fetched on the server by the page */
  countries: Country[];
}

export default function CreateAccountForm({ countries }: CreateAccountFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showNotification } = useNotification();

  const schema = useMemo(() => createAccountSchema(countries), [countries]);
  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.code, label: c.name })),
    [countries],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      agencyName: '',
      fullName: '',
      // India first, as most agencies are Indian
      country: (countries.find((c) => c.code.endsWith('(IN)')) ?? countries[0])?.code ?? '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      termStatus: false,
    },
  });

  const countryCode = useWatch({ control, name: 'country' });
  const selectedCountry = countries.find((c) => c.code === countryCode);

  const onSubmit = ({
    country,
    mobileNumber,
    fullName,
    agencyName,
    email,
    password,
  }: CreateAccountFormValues) => {
    startTransition(async () => {
      const result = await registerAction({
        fullName,
        agencyName,
        email,
        password,
        country: countries.find((c) => c.code === country)?.name,
        phoneNumber: `${dialCode(country)}-${mobileNumber}`,
        termStatus: true,
        role: 'agency',
      });
      if (!result.success) {
        result.errors.forEach((message) => {
          showNotification(STRINGS.ERROR, message, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      router.push(ROUTES.VERIFY);
    });
  };

  // Shared by every text field so they all use the roomy 16px scale
  const fieldProps = {
    required: true,
    disabled: isPending,
    fieldClassName: styles.field,
    inputClassName: styles.input,
  };

  return (
    <div data-testid="CreateAccountFormTest" className={styles.createAccountForm}>
      <header className={styles.header}>
        <Heading2 tag="h1" className={styles.title}>
          {STRINGS.CREATE_ACCOUNT_HEADING}
        </Heading2>
        <BodyLg className={styles.description}>{STRINGS.CREATE_ACCOUNT_DESCRIPTION}</BodyLg>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isPending}
      >
        <InputField
          {...register('agencyName')}
          {...fieldProps}
          label={STRINGS.AGENCY_NAME}
          autoComplete="organization"
          placeholder={STRINGS.AGENCY_NAME_PLACEHOLDER}
          error={errors.agencyName?.message}
        />

        <div className={styles.row}>
          <InputField
            {...register('fullName')}
            {...fieldProps}
            label={STRINGS.CONTACT_PERSON_NAME}
            autoComplete="name"
            placeholder={STRINGS.FULL_NAME_PLACEHOLDER}
            error={errors.fullName?.message}
          />

          <Controller
            name="country"
            control={control}
            render={({ field: { value, onChange, name } }) => (
              <Dropdown
                name={name}
                label={STRINGS.COUNTRY}
                required
                options={countryOptions}
                value={value || null}
                onChange={onChange}
                placeholder={STRINGS.SELECT_COUNTRY}
                error={errors.country?.message}
                disabled={isPending}
                className={styles.dropdown}
                fieldClassName={styles.field}
              />
            )}
          />
        </div>

        <InputField
          {...register('email')}
          {...fieldProps}
          label={STRINGS.BUSINESS_EMAIL}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={STRINGS.ENTER_EMAIL}
          error={errors.email?.message}
        />

        <MobileNumberInput
          {...register('mobileNumber')}
          {...fieldProps}
          label={STRINGS.MOBILE_NUMBER}
          dialCode={selectedCountry && dialCode(selectedCountry.code)}
          dialCodeClassName={styles.input}
          maxLength={selectedCountry?.length}
          error={errors.mobileNumber?.message}
        />

        <div className={styles.row}>
          <InputField
            {...register('password')}
            {...fieldProps}
            label={STRINGS.PASSWORD}
            type="password"
            autoComplete="new-password"
            helperText={STRINGS.PASSWORD_HINT}
            error={errors.password?.message}
          />

          <InputField
            {...register('confirmPassword')}
            {...fieldProps}
            label={STRINGS.CONFIRM_PASSWORD}
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />
        </div>

        <Controller
          name="termStatus"
          control={control}
          render={({ field: { value, onChange, onBlur, name, ref } }) => (
            <CheckBox
              ref={ref}
              name={name}
              required
              label={
                <>
                  {STRINGS.I_AGREE_TO_THE}{' '}
                  <AppLink href={ROUTES.TERMS} className={styles.link}>
                    {STRINGS.TERMS_OF_SERVICE}
                  </AppLink>{' '}
                  {STRINGS.AND}{' '}
                  <AppLink href={ROUTES.PRIVACY} className={styles.link}>
                    {STRINGS.PRIVACY_POLICY}
                  </AppLink>
                </>
              }
              labelClassName={styles.checkboxLabel}
              checked={!!value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.termStatus?.message}
              disabled={isPending}
            />
          )}
        />

        <Button type="submit" loading={isPending} className={styles.submit}>
          {STRINGS.CREATE_ACCOUNT}
        </Button>
      </form>

      <Body className={styles.footer}>
        {STRINGS.ALREADY_REGISTERED}{' '}
        <AppLink href={ROUTES.LOGIN} className={styles.link}>
          {STRINGS.SIGN_IN}
        </AppLink>
      </Body>
    </div>
  );
}
