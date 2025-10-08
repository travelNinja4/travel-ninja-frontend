'use client';

import DynamicForm from '@/components/DynamicForm';

import { KeyRound } from 'lucide-react';
import { STRINGS } from '@/constants/strings';
import { resetPasswordSchema } from './ResetPasswordSchema';
import { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import styles from './ResetPassword.module.scss';

export const resetPasswordFormConfig: FieldConfig[] = [
  {
    name: 'title',
    label: STRINGS.CHANGE_YOUR_PASSWORD,
    type: 'label',
    tag: 'h2',
    textAlign: 'center',
    children: null,
    validationHints: [],
    className: styles.title,
  },
  {
    name: 'subTitle',
    label: STRINGS.CHANGE_YOUR_PASSWORD_INSTRUCTION,
    type: 'label',
    tag: 'h3',
    textAlign: 'center',
    validationHints: [],
    className: styles.subTitle,
  },
  {
    name: 'password',
    label: STRINGS.NEW_PASSWORD,
    type: 'password',
    required: true,
    placeholder: STRINGS.ENTER_NEW_PASSWORD,
    maxLength: 12,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'confirmPassword',
    label: STRINGS.CONFIRM_PASSWORD,
    type: 'password',
    required: true,
    placeholder: STRINGS.RE_ENTER_NEW_PASSWORD,
    maxLength: 12,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'submit',
    label: STRINGS.RESET_PASSWORD,
    type: 'button',
    buttonType: 'submit',
    startIcon: KeyRound,
    iconColor: 'var(--color-white)',
    className: styles.submitButton,
  },
];

export default function ResetPasswordForm() {
  return (
    <DynamicForm
      fields={resetPasswordFormConfig}
      schema={resetPasswordSchema}
      className={styles.forgotPasswordContainer}
      //   loading={isLoading}
      onSubmit={() => {}}
    />
  );
}
