/**
 * Login form: work email, password, remember me, and links to reset the
 * password or create an account. Validates with `loginSchema`, then calls the
 * `loginAction` server action and sends the user to the dashboard.
 *
 * The heading lives here (not in the page) so the form and its title stay
 * together; the page only handles layout.
 */
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginAction } from '@/actions/auth';
import AppLink from '@/components/AppLink';
import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import InputField from '@/components/InputField';
import { Body, BodyLg, Heading2 } from '@/components/Typography';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { useNotification } from '@/providers/NotificationProvider';
import { loginSchema, type LoginFormValues } from './LoginSchema';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = ({ email, password, rememberMe = false }: LoginFormValues) => {
    startTransition(async () => {
      const result = await loginAction({ email, password, rememberMe });
      if (!result.success) {
        result.errors.forEach((message) => {
          showNotification(STRINGS.ERROR, message, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      showNotification(STRINGS.SUCCESS, STRINGS.LOGGED_IN_SUCCESSFUL, NOTIFICATION_TYPES.SUCCESS);
      router.push(ROUTES.DASHBOARD);
    });
  };

  return (
    <div data-testid="LoginFormTest" className={styles.loginForm}>
      <header className={styles.header}>
        <Heading2 tag="h1" className={styles.title}>
          {STRINGS.SIGN_IN_HEADING}
        </Heading2>
        <BodyLg className={styles.description}>{STRINGS.SIGN_IN_DESCRIPTION}</BodyLg>
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
          autoComplete="username"
          placeholder={STRINGS.ENTER_EMAIL}
          error={errors.email?.message}
          disabled={isPending}
          fieldClassName={styles.field}
          inputClassName={styles.input}
        />

        <InputField
          {...register('password')}
          label={STRINGS.PASSWORD}
          type="password"
          autoComplete="current-password"
          placeholder={STRINGS.ENTER_YOUR_PASSWORD}
          error={errors.password?.message}
          disabled={isPending}
          fieldClassName={styles.field}
          inputClassName={styles.input}
        />

        <div className={styles.options}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field: { value, onChange, onBlur, name, ref } }) => (
              <CheckBox
                ref={ref}
                name={name}
                label={STRINGS.REMEMBER_ME}
                labelClassName={styles.checkboxLabel}
                checked={!!value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={isPending}
              />
            )}
          />
          <AppLink href={ROUTES.FORGOT_PASSWORD} className={styles.link}>
            {STRINGS.FORGOT_PASSWORD_LINK}
          </AppLink>
        </div>

        <Button type="submit" loading={isPending} className={styles.submit}>
          {STRINGS.SIGN_IN}
        </Button>
      </form>

      <Body className={styles.footer}>
        {STRINGS.NEW_AGENCY}{' '}
        <AppLink href={ROUTES.CREATE_ACCOUNT} className={styles.link}>
          {STRINGS.CREATE_AN_ACCOUNT}
        </AppLink>
      </Body>
    </div>
  );
}
