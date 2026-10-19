/**
 * Forgot password form: work email and a link back to sign in. Validates with
 * `forgotPasswordSchema`, then calls the `forgotPasswordAction` server action,
 * confirms with a toast and returns the user to sign in.
 *
 * The page handles layout (AuthLayout).
 */
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordAction } from '@/actions/auth';
import AppLink from '@/components/AppLink';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { Body, BodyLg, Heading2 } from '@/components/Typography';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { useNotification } from '@/providers/NotificationProvider';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from './ForgotPasswordSchema';
import styles from './ForgotPassword.module.scss';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    startTransition(async () => {
      const result = await forgotPasswordAction(data);
      if (!result.success) {
        result.errors.forEach((message) => {
          showNotification(STRINGS.ERROR, message, NOTIFICATION_TYPES.ERROR);
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
    <div data-testid="ForgotPasswordFormTest" className={styles.forgotPasswordForm}>
      <header className={styles.header}>
        <Heading2 tag="h1" className={styles.title}>
          {STRINGS.RESET_YOUR_PASSWORD}
        </Heading2>
        <BodyLg className={styles.description}>{STRINGS.RESET_YOUR_PASSWORD_DESCRIPTION}</BodyLg>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isPending}
      >
        <InputField
          {...register('email')}
          label={STRINGS.WORK_EMAIL}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={STRINGS.AGENCY_EMAIL_PLACEHOLDER}
          error={errors.email?.message}
          disabled={isPending}
          fieldClassName={styles.field}
          inputClassName={styles.input}
        />

        <Button type="submit" loading={isPending} className={styles.submit}>
          {STRINGS.SEND_RESET_LINK}
        </Button>
      </form>

      <Body className={styles.footer}>
        <AppLink href={ROUTES.LOGIN} className={styles.backLink}>
          {STRINGS.BACK_TO_SIGN_IN}
        </AppLink>
      </Body>
    </div>
  );
}
