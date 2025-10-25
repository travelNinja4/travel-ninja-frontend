'use client';

import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { ROUTES, STRINGS } from '@/constants/strings';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorPageContainer}>
      <div className={styles.errorCard}>
        <CircleX size={48} color="red" />
        <Typography tag="h2">{STRINGS.LINK_EXPIRED}</Typography>
        <Typography tag="p" className={styles.resetPasswordInstruction} align="center">
          {STRINGS.INVALID_TOKEN_INSTRUCTION}
        </Typography>
        <Button className={styles.errorCardButton} onClick={() => router.push(ROUTES.LOGIN)}>
          {STRINGS.BACK_TO_LOG_IN}
        </Button>
      </div>
    </div>
  );
}
