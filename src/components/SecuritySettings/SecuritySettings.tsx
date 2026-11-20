/**
 * The Security part of the settings screen: two cards stacked.
 *
 *   Security         change password: current password on its own row,
 *                    new password + confirm side by side from tablet up
 *   Active sessions  the devices signed in to the account; every one but the
 *                    current device can be revoked
 *
 * UI only for now: the form doesn't submit and Revoke only calls `onRevoke`.
 * The sessions table scrolls sideways inside its card if it ever runs out of room.
 *
 * @example
 * ```tsx
 * import SecuritySettings from '@/components/SecuritySettings'
 *
 * export default function SettingsPage() {
 *   return <SecuritySettings sessions={sessions} />;
 * }
 * ```
 */
'use client';

import { FormEvent, ReactNode, useId } from 'react';
import { SECURITY_SETTINGS } from '@/constants/strings';
import type { ActiveSession } from '@/constants/types';
import Typography from '../Typography';
import InputField from '../InputField';
import Button from '../Button';
import StatusBadge from '../StatusBadge';
import styles from './SecuritySettings.module.scss';

/**
 * Define the props available for the SecuritySettings component.
 */
interface SecuritySettingsProps {
  /**
   * Devices signed in to the account, the current one included.
   */
  sessions: ActiveSession[];

  /**
   * Called with the session whose Revoke button was pressed.
   */
  onRevoke?: (session: ActiveSession) => void;
}

/** A bordered card with a title bar, shared by both sections */
function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={styles.card}>
      <Typography variant="title-md" tag="h2" id={titleId} className={styles.cardHeader}>
        {title}
      </Typography>
      {children}
    </section>
  );
}

// No submit handler yet: stop the browser reloading the page
const preventSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

export default function SecuritySettings({ sessions, onRevoke }: SecuritySettingsProps) {
  const changePasswordId = useId();

  return (
    <div data-testid="SecuritySettingsTest" className={styles.container}>
      <SettingsCard title={SECURITY_SETTINGS.TITLE}>
        <form
          noValidate
          aria-labelledby={changePasswordId}
          className={styles.passwordForm}
          onSubmit={preventSubmit}
        >
          <Typography variant="title-sm" tag="h3" id={changePasswordId} className={styles.subtitle}>
            {SECURITY_SETTINGS.CHANGE_PASSWORD}
          </Typography>

          <InputField
            type="password"
            name="currentPassword"
            label={SECURITY_SETTINGS.CURRENT_PASSWORD}
            autoComplete="current-password"
            className={styles.fullWidth}
          />
          <InputField
            type="password"
            name="newPassword"
            label={SECURITY_SETTINGS.NEW_PASSWORD}
            autoComplete="new-password"
          />
          <InputField
            type="password"
            name="confirmPassword"
            label={SECURITY_SETTINGS.CONFIRM_PASSWORD}
            autoComplete="new-password"
          />

          <div className={styles.fullWidth}>
            <Button type="submit" className={styles.submit}>
              {SECURITY_SETTINGS.UPDATE_PASSWORD}
            </Button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard title={SECURITY_SETTINGS.SESSIONS_TITLE}>
        {/* Focusable so keyboard users can scroll it when it overflows */}
        <div
          className={styles.scroller}
          role="region"
          aria-label={SECURITY_SETTINGS.SESSIONS_TITLE}
          tabIndex={0}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.headerCell}>
                  {SECURITY_SETTINGS.DEVICE}
                </th>
                <th scope="col" className={styles.headerCell}>
                  {SECURITY_SETTINGS.LOCATION}
                </th>
                <th scope="col" className={styles.headerCell}>
                  {SECURITY_SETTINGS.LAST_ACTIVE}
                </th>
                <th scope="col" className={styles.headerCell}>
                  <span className={styles.visuallyHidden}>{SECURITY_SETTINGS.ACTIONS}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.cell}>
                    {SECURITY_SETTINGS.NO_SESSIONS}
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className={styles.row}>
                    <td className={styles.cell}>
                      <span className={styles.device}>
                        {session.device}
                        {session.current && (
                          <StatusBadge status="confirmed">{SECURITY_SETTINGS.CURRENT}</StatusBadge>
                        )}
                      </span>
                    </td>
                    <td className={styles.cell}>{session.location}</td>
                    <td className={styles.cell}>{session.lastActive}</td>
                    <td className={styles.cell}>
                      {session.current ? (
                        <span aria-hidden="true" className={styles.muted}>
                          —
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          className={styles.revoke}
                          onClick={() => onRevoke?.(session)}
                        >
                          {SECURITY_SETTINGS.REVOKE}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}
