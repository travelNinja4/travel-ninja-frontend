'use client';

import { useTransition } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { forgotPasswordSchema } from './ForgotPasswordSchema';
import { Send, ArrowLeft } from 'lucide-react';
import AppLink from '@/components/AppLink';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { forgotPassword } from '@/constants/types';
import { forgotPasswordAction } from '@/actions/auth';
import { useNotification } from '@/providers/NotificationProvider';
import { useRouter } from 'next/navigation';
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
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleResetLink = (formData: forgotPassword) => {
    startTransition(async () => {
      const result = await forgotPasswordAction(formData);
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      showNotification(
        STRINGS.SUCCESS,
        STRINGS.RESET_LINK_INSTRUCTIONS,
        NOTIFICATION_TYPES.SUCCESS,
      );
      router.push(ROUTES.LOGIN);
    });
  };

  return (
    <DynamicForm
      fields={forgotPasswordFormConfig}
      schema={forgotPasswordSchema}
      className={styles.forgotPasswordContainer}
      loading={isPending}
      onSubmit={handleResetLink}
    />
  );
}
