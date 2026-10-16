'use client';

import { useMemo, useTransition } from 'react';
import DynamicForm, { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import { createAccountSchema } from './CreateAccountSchema';
import AppLink from '@/components/AppLink';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { AccountData, Country } from '@/constants/types';
import { registerAction } from '@/actions/auth';
import { useNotification } from '@/providers/NotificationProvider';
import styles from './CreateAccountForm.module.scss';

export const createAccountFormConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Create Your Agency Account',
    type: 'label',
    tag: 'h2',
    textAlign: 'center',
    children: null,
    validationHints: [],
    className: styles.title,
  },
  {
    name: 'subTitle',
    label: 'Start your journey with TravelNinja today',
    type: 'label',
    tag: 'h3',
    textAlign: 'center',
    validationHints: [],
    className: styles.subTitle,
  },
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'input',
    placeholder: 'Enter full name',
    required: true,
    maxLength: 50,
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'agencyName',
    label: 'Agency Name',
    type: 'input',
    placeholder: 'Enter agency name',
    required: true,
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'input',
    required: true,
    placeholder: 'Enter email address',
    maxLength: 50,
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'website',
    label: 'Website(optional)',
    type: 'input',
    placeholder: 'https://yourwebsite.com',
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'phoneNumber',
    label: 'Mobile Number',
    type: 'MobileNumberInput',
    placeholder: 'Enter mobile number',
    required: true,
    maxLength: 10,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'address',
    label: 'Address',
    type: 'input',
    placeholder: 'Enter full address',
    required: true,
    maxLength: 200,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'city',
    label: 'City',
    type: 'input',
    placeholder: 'Enter city',
    required: true,
    maxLength: 20,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'state',
    label: 'State',
    type: 'input',
    placeholder: 'Enter state',
    required: true,
    maxLength: 20,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'country',
    label: 'Country',
    type: 'input',
    placeholder: 'Enter Country',
    required: true,
    maxLength: 20,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a password',
    required: true,
    maxLength: 12,
    width: FieldWidth.FULL,
    validationHints: [
      { label: 'At least 8 characters', regex: /^.{8,}$/ },
      { label: 'One uppercase letter', regex: /[A-Z]/ },
      { label: 'One lowercase letter', regex: /[a-z]/ },
      { label: 'One number', regex: /\d/ },
      { label: 'One special character', regex: /[@$!%*?&]/ },
    ],
  },
  {
    name: 'termStatus',
    label: (
      <>
        I agree to the{' '}
        <AppLink href="/terms" className={styles.termsPolicy}>
          Terms of Service
        </AppLink>{' '}
        and{' '}
        <AppLink href="/privacy" className={styles.termsPolicy}>
          Privacy Policy
        </AppLink>
      </>
    ),
    type: 'checkbox',
    required: true,
    validationHints: [],
    className: styles.termStatusCheckbox,
  },
  {
    name: 'submit',
    label: 'Create Account',
    type: 'button',
    buttonType: 'submit',
    className: styles.submitButton,
    startIcon: UserPlus,
    iconColor: 'var(--color-white)',
  },
];

interface CreateAccountFormProps {
  /** Country codes, fetched on the server by the page */
  countries: Country[];
}

export default function CreateAccountForm({ countries }: CreateAccountFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(() => createAccountSchema(countries), [countries]);
  const fields = useMemo(
    () =>
      createAccountFormConfig.map((field) =>
        field.type === 'MobileNumberInput' ? { ...field, countries } : field,
      ),
    [countries],
  );

  const handleSubmit = (formData: AccountData) => {
    startTransition(async () => {
      const rawCountry = formData.phoneNumber?.country ?? '';
      const countryCode = rawCountry.split('(')[0].trim();
      const result = await registerAction({
        ...formData,
        phoneNumber: `${countryCode}-${formData.phoneNumber?.number}`,
        role: 'agency',
      });
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      router.push(ROUTES.VERIFY);
    });
  };

  return (
    <DynamicForm
      fields={fields}
      schema={schema}
      className={styles.createAccountContainer}
      loading={isPending}
      onSubmit={handleSubmit}
    />
  );
}
