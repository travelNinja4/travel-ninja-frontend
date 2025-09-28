/**
 * NotificationContainer renders active notifications on screen with their styles, positions, progress bars, and close buttons, while handling display and dismissal animations.
 *
 * @example
 * ```tsx
 * import NotificationContainer from '@src/components/NotificationContainer'
 *
 * export default function NotificationContainer() {
 *   return <NotificationContainer label="Hello" />;
 * }
 * ```
 */
'use client';

import { useEffect, useState } from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react';
import clsx from 'clsx';
import Typography from '@/components/Typography';
import { NOTIFICATION_TYPES } from '@/constants/strings';
import styles from './NotificationContainer.module.scss';

/**
 * Define the props available for the NotificationContainer component.
 */
interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  showProgress?: boolean;
  position?: string;
}

const iconMap = {
  success: <CircleCheck height={24} width={24} color="var(--notification-success-icon)" />,
  error: <CircleX height={24} width={24} color="var(--notification-error-icon)" />,
  warning: <TriangleAlert height={24} width={24} color="var(--notification-warning-icon)" />,
  info: <Info height={24} width={24} color="var(--notification-info-icon)" />,
};

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ClassNames {
  title: string;
  message: string;
}

export default function NotificationContainer({
  notifications,
  removeNotification,
}: NotificationContainerProps) {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setActiveNotifications(notifications);
  }, [notifications]);

  // Group by position
  const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'];

  const getNotificationClassNames = (type: NotificationType): ClassNames => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return {
          title: clsx(styles.notificationTitle, styles.successTitle),
          message: clsx(styles.notificationMessage, styles.successNotificationMessage),
        };
      case NOTIFICATION_TYPES.ERROR:
        return {
          title: clsx(styles.notificationTitle, styles.errorTitle),
          message: clsx(styles.notificationMessage, styles.errorNotificationMessage),
        };
      case NOTIFICATION_TYPES.WARNING:
        return {
          title: clsx(styles.notificationTitle, styles.warningTitle),
          message: clsx(styles.notificationMessage, styles.warningNotificationMessage),
        };
      case NOTIFICATION_TYPES.INFO:
        return {
          title: clsx(styles.notificationTitle, styles.infoTitle),
          message: clsx(styles.notificationMessage, styles.infoNotificationMessage),
        };
      default:
        return {
          title: styles.notificationTitle,
          message: styles.notificationMessage,
        };
    }
  };

  return (
    <div data-testid="NotificationContainerTest">
      {positions.map((pos) => (
        <div key={pos} className={clsx(styles.notificationWrapper, styles[pos])}>
          {activeNotifications
            .filter((n) => (n.position || 'top-right') === pos)
            .map((n) => {
              const classNames = getNotificationClassNames(n.type);
              return (
                <div key={n.id} className={clsx(styles.notification, styles[n.type], styles.show)}>
                  <div className={styles.notificationIcon}>{iconMap[n.type]}</div>
                  <div className={styles.notificationText}>
                    <Typography tag="h4" className={classNames.title}>
                      {n.title}
                    </Typography>
                    <Typography tag="p" className={classNames.message}>
                      {n.message}
                    </Typography>
                  </div>

                  <div
                    className={styles.notificationClose}
                    data-testid="notification-close-btn"
                    onClick={() => removeNotification(n.id)}
                  >
                    <X height={24} width={24} color="var(--notification-close-icon)" />
                  </div>
                  {n.showProgress && n.duration && (
                    <div className={styles.notificationProgress}>
                      <div
                        className={styles.notificationProgressBar}
                        style={{ animationDuration: `${n.duration}ms` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
