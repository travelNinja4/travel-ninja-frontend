import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>This trail doesn&rsquo;t exist</h1>
        <p className={styles.message}>
          The page you&rsquo;re looking for may have been moved, archived, or never published.
        </p>
        <Link href="/dashboard" className={styles.primaryAction}>
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
