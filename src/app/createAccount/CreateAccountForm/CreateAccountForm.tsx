import DynamicForm, { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import { createAccountSchema } from './CreateAccountSchema';
import AppLink from '@/components/AppLink';
import { UserPlus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/strings';
import styles from './CreateAccountForm.module.scss';

export const createAccountFormConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Create Your Agency Account',
    type: 'label',
    tag: 'h2',
    children: null,
    validationHints: [],
    className: styles.title,
  },
  {
    name: 'subTitle',
    label: 'Start your journey with TravelNinja today',
    type: 'label',
    tag: 'h3',
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
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'state',
    label: 'State',
    type: 'input',
    placeholder: 'Enter state',
    required: true,
    maxLength: 20,
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'pincode',
    label: 'Post Code',
    type: 'input',
    placeholder: 'Enter post code',
    required: true,
    maxLength: 6,
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'phoneNumber',
    label: 'Mobile Number',
    type: 'input',
    placeholder: 'Enter mobile number',
    required: true,
    maxLength: 10,
    width: FieldWidth.HALF,
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

export default function CreateAccountForm() {
  const handleSubmit = () => {
    redirect(ROUTES.VERIFY);
  };

  return (
    <DynamicForm
      fields={createAccountFormConfig}
      schema={createAccountSchema}
      onSubmit={handleSubmit}
      className={styles.createAccountContainer}
    />
  );
}
