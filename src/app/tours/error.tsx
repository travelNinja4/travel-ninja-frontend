'use client';

import { useEffect } from 'react';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { TOURS } from '@/constants/strings';
import styles from './error.module.scss';

export default function ToursError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console -- surfaced for debugging until error reporting is wired in
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className={styles.container}>
      <Typography variant="heading-4" tag="h1">
        {TOURS.LOAD_ERROR_TITLE}
      </Typography>
      <Typography variant="body" className={styles.description}>
        {TOURS.LOAD_ERROR_DESCRIPTION}
      </Typography>
      <Button onClick={() => retry()}>{TOURS.TRY_AGAIN}</Button>
    </div>
  );
}
