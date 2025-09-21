import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/strings';
import styles from './page.module.css';

export default function Home() {
  redirect(ROUTES.LOGIN);
}
