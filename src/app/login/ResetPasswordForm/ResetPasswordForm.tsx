'use client';

import DynamicForm from '@/components/DynamicForm';
import { KeyRound } from 'lucide-react';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { resetPasswordSchema } from './ResetPasswordSchema';
import { FieldConfig, FieldWidth } from '@/components/DynamicForm/DynamicForm';
import { resetPassword } from '@/constants/types';
import { resetPasswordAction } from '@/actions/auth';
import { useNotification } from '@/providers/NotificationProvider';
import { useRouter } from 'next/navigation';
import styles from './ResetPassword.module.scss';
import { useTransition } from 'react';

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
    name: 'newPassword',
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

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();

  const handleResetPassword = (formData: resetPassword) => {
    startTransition(async () => {
      const result = await resetPasswordAction(token, formData);
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      showNotification(STRINGS.SUCCESS, STRINGS.PASSWORD_RESET_SUCCESS, NOTIFICATION_TYPES.SUCCESS);
      router.push(ROUTES.LOGIN);
    });
  };

  return (
    <DynamicForm
      fields={resetPasswordFormConfig}
      schema={resetPasswordSchema}
      className={styles.forgotPasswordContainer}
      loading={isPending}
      onSubmit={handleResetPassword}
    />
  );
}
