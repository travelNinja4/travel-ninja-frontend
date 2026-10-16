'use client';

import { useTransition } from 'react';
import { LogIn } from 'lucide-react';
import AppLink from '@/components/AppLink';
import { useRouter } from 'next/navigation';
import { loginSchema } from './LoginSchema';
import { Login } from '@/constants/types';
import { loginAction } from '@/actions/auth';
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
  const [isPending, startTransition] = useTransition();
  const { showNotification } = useNotification();

  const handleLogin = (formData: Login) => {
    startTransition(async () => {
      const result = await loginAction(formData);
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      router.push(ROUTES.OTP_VERIFICATION);
    });
  };

  return (
    <DynamicForm
      fields={loginFormConfig}
      schema={loginSchema}
      loading={isPending}
      className={styles.loginContainer}
      onSubmit={handleLogin}
    />
  );
}
