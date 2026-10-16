'use client';

import { LogIn } from 'lucide-react';
import AppLink from '@/components/AppLink';
import { useRouter } from 'next/navigation';
import { loginSchema } from './LoginSchema';
import { useAuthStore } from '@/store/auth';
import { errorHandler } from '@/utils/errorHandler';
import { useApiStatusStore } from '@/store/apiStatus';
import { authService, Login } from '@/services/authService';
import { useNotification } from '@/providers/NotificationProvider';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import DynamicForm, { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import styles from './LoginForm.module.scss';

export const loginFormConfig: FieldConfig[] = [
  {
    name: 'title',
    label: STRINGS.WELCOME_BACK,
    type: 'label',
    tag: 'h2',
    children: null,
    textAlign: 'center',
    validationHints: [],
    className: styles.title,
  },
  {
    name: 'subTitle',
    label: STRINGS.SIGN_IN_TITLE,
    type: 'label',
    tag: 'h3',
    textAlign: 'center',
    validationHints: [],
    className: styles.subTitle,
  },
  {
    name: 'email',
    label: STRINGS.EMAIL_ADDRESS,
    type: 'input',
    required: true,
    placeholder: STRINGS.ENTER_YOUR_EMAIL,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'password',
    label: STRINGS.PASSWORD,
    type: 'password',
    placeholder: STRINGS.ENTER_YOUR_PASSWORD,
    required: true,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'forgotPassword',
    label: (
      <>
        <AppLink href="/login/forgot-password" className={styles.forgotPassword}>
          {STRINGS.FORGOT_PASSWORD}
        </AppLink>
      </>
    ),
    type: 'label',
    validationHints: [],
    textAlign: 'right',
    className: styles.forgotPassword,
  },
  {
    name: 'signIn',
    label: STRINGS.SIGN_IN,
    type: 'button',
    buttonType: 'submit',
    className: styles.submitButton,
    startIcon: LogIn,
    iconColor: 'var(--color-white)',
  },
  {
    name: 'signUpText',
    label: (
      <>
        {STRINGS.DONT_HAVE_ACCOUNT}{' '}
        <AppLink href={ROUTES.CREATE_ACCOUNT} className={styles.signUpText}>
          {STRINGS.CREATE_NEW_ACCOUNT}
        </AppLink>
      </>
    ),
    type: 'label',
    tag: 'p',
    textAlign: 'center',
    validationHints: [],
  },
];

export default function LoginForm() {
  const router = useRouter();
  const { isLoading } = useApiStatusStore((store) => store);
  const { showNotification } = useNotification();
  const { setAccountData } = useAuthStore((store) => store);

  const handleLogin = async (formData: Login) => {
    try {
      const requestParams = {
        ...formData,
        // role: 'agency',
      };
      // const encryptedBody = encryptObject(requestParams, ['password']);
      const loginResponse = await authService.login(requestParams);
      setAccountData(loginResponse.data);
      router.push(ROUTES.OTP_VERIFICATION);
    } catch (err: unknown) {
      const messages = errorHandler(err);
      messages.forEach((errMsg) => {
        showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
      });
    }
  };

  return (
    <DynamicForm
      fields={loginFormConfig}
      schema={loginSchema}
      loading={isLoading}
      className={styles.loginContainer}
      onSubmit={handleLogin}
    />
  );
}
