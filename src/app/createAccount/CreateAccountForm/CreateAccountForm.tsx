import DynamicForm, { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import { createAccountSchema } from './CreateAccountSchema';
import styles from './CreateAccountForm.module.scss';
import AppLink from '@/components/AppLink';
import { UserPlus } from 'lucide-react';

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
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'city',
    label: 'City',
    type: 'input',
    placeholder: 'Enter city',
    required: true,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'state',
    label: 'State',
    type: 'input',
    placeholder: 'Enter State',
    required: true,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'postCode',
    label: 'Post Code',
    type: 'input',
    placeholder: 'Enter post code',
    required: true,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a password',
    required: true,
    width: FieldWidth.HALF,
    validationHints: [
      { label: 'At least 8 characters', regex: /^.{8,}$/ },
      { label: 'One uppercase letter', regex: /[A-Z]/ },
      { label: 'One lowercase letter', regex: /[a-z]/ },
      { label: 'One number', regex: /\d/ },
      { label: 'One special character', regex: /[@$!%*?&]/ },
    ],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'input',
    placeholder: 'Confirm your password',
    required: true,
    width: FieldWidth.HALF,
    validationHints: [],
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
  return (
    <DynamicForm
      fields={createAccountFormConfig}
      schema={createAccountSchema}
      onSubmit={() => {}}
      className={styles.createAccountContainer}
    />
  );
}
