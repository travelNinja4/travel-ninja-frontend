import DynamicForm, { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import { loginSchema } from './LoginSchema';
import styles from './LoginForm.module.scss';
import AppLink from '@/components/AppLink';
import { LogIn } from 'lucide-react';
import { ROUTES } from '@/constants/strings';

export const loginFormConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Welcome Back',
    type: 'label',
    tag: 'h2',
    children: null,
    textAlign: 'center',
    validationHints: [],
    className: styles.title,
  },
  {
    name: 'subTitle',
    label: 'Sign in to your agency account',
    type: 'label',
    tag: 'h3',
    textAlign: 'center',
    validationHints: [],
    className: styles.subTitle,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'input',
    required: true,
    placeholder: 'Enter your email',
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'input',
    placeholder: 'Enter your password',
    required: true,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'forgotPassword',
    label: (
      <>
        <AppLink href="/terms" className={styles.forgotPassword}>
          Forgot password?
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
    label: 'Sign In',
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
        Don&apos;t have an account?{' '}
        <AppLink href={ROUTES.CREATE_ACCOUNT} className={styles.signUpText}>
          Create a new account
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
  return (
    <DynamicForm
      fields={loginFormConfig}
      schema={loginSchema}
      onSubmit={() => {}}
      className={styles.createAccountContainer}
    />
  );
}
