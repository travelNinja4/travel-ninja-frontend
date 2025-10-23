'use client';

import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { ROUTES } from '@/constants/strings';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.subCardContainer}>
        <CircleX size={48} color="red" />
        <Typography tag="h2">Link Expired</Typography>
        <Typography tag="p" className={styles.resetPasswordInstruction} align="center">
          To reset password, return to the login page and select &quot;Forgot Password&quot; to send
          a new email
        </Typography>
        <Button className={styles.backButton} onClick={() => router.push(ROUTES.LOGIN)}>
          Back to log in
        </Button>
      </div>
    </div>
  );
}
