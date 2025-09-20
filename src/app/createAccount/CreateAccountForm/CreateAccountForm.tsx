import DynamicForm, { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import { createAccountSchema } from './CreateAccountSchema';
import AppLink from '@/components/AppLink';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/strings';
import { AccountData, useAuthStore } from '@/store/auth';
import styles from './CreateAccountForm.module.scss';
import { useApiStatusStore } from '@/store/apiStatus';
import { authService } from '@/services/authService';

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
    name: 'pincode',
    label: 'Post Code',
    type: 'input',
    placeholder: 'Enter post code',
    required: true,
    maxLength: 6,
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
  const router = useRouter();
  const setAccountData = useAuthStore((store) => store.setAccountData);
  const isLoading = useApiStatusStore((store) => store.isLoading);
  console.log('isLoading>>>', isLoading);

  const handleSubmit = async (formData: AccountData) => {
    try {
      const requestParams = {
        ...formData,
        phoneNumber: `+91${formData?.phoneNumber}`,
        role: 'agency',
      };
      console.log('requestParams>>>', requestParams);
      const response = await authService.register(requestParams);
      console.log('User registered successfully:', response);
      setAccountData(formData);
      router.push(ROUTES.VERIFY);
    } catch (err: unknown) {
      console.log('error>>>', err);
    }
  };

  return (
    <DynamicForm
      fields={createAccountFormConfig}
      schema={createAccountSchema}
      className={styles.createAccountContainer}
      loading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}
