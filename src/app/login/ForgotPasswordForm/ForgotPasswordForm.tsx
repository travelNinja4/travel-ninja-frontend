'use client';

import DynamicForm from '@/components/DynamicForm';
import { forgotPasswordSchema } from './ForgotPasswordSchema';
import { Send, ArrowLeft } from 'lucide-react';
import AppLink from '@/components/AppLink';
import { ROUTES, STRINGS } from '@/constants/strings';
import { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import styles from './ForgotPassword.module.scss';

export const forgotPasswordFormConfig: FieldConfig[] = [
  {
    name: 'title',
    label: STRINGS.FORGOT_PASSWORD,
    type: 'label',
    tag: 'h2',
    textAlign: 'center',
    children: null,
    validationHints: [],
    className: styles.title,
  },
  {
    name: 'subTitle',
    label: STRINGS.RESET_PASSWORD_INSTRUCTION,
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
    placeholder: STRINGS.ENTER_EMAIL_ADDRESS,
    maxLength: 50,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'note',
    label: STRINGS.RESET_PASSWORD_LABEL,
    type: 'label',
    tag: 'span',
    textAlign: 'start',
    validationHints: [],
    className: styles.note,
  },
  {
    name: 'submit',
    label: STRINGS.SEND_RESET_LINK,
    type: 'button',
    buttonType: 'submit',
    startIcon: Send,
    iconColor: 'var(--color-white)',
    className: styles.submitButton,
  },
  {
    name: 'backToLogin',
    label: (
      <AppLink href={ROUTES.LOGIN} className={styles.backLink}>
        <ArrowLeft className={styles.backIcon} />
        <span className={styles.backText}>{STRINGS.BACK_TO_LOGIN}</span>
      </AppLink>
    ),
    type: 'label',
    tag: 'p',
    textAlign: 'center',
    validationHints: [],
  },
];

export default function ForgotPasswordForm() {
  return (
    <DynamicForm
      fields={forgotPasswordFormConfig}
      schema={forgotPasswordSchema}
      className={styles.forgotPasswordContainer}
      //   loading={isLoading}
      onSubmit={() => {}}
    />
  );
}
