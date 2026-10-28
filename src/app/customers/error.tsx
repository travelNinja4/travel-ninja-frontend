'use client';

import { useEffect } from 'react';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { CUSTOMERS } from '@/constants/strings';
import styles from './error.module.scss';

export default function CustomersError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console -- surfaced for debugging until error reporting is wired in
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className={styles.container}>
      <Typography variant="heading-4" tag="h1">
        {CUSTOMERS.LOAD_ERROR_TITLE}
      </Typography>
      <Typography variant="body" className={styles.description}>
        {CUSTOMERS.LOAD_ERROR_DESCRIPTION}
      </Typography>
      <Button onClick={() => retry()}>{CUSTOMERS.TRY_AGAIN}</Button>
    </div>
  );
}
