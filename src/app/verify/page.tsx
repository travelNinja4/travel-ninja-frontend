'use client';

import CustomImage from '@/components/CustomImage';
import OtpVerification from '@/components/OtpVerification';
import styles from './page.module.scss';
import { useState } from 'react';

export default function Verify() {
  const [step, setStep] = useState<'email' | 'mobile'>('email');
  return (
    <>
      {step === 'email' && <OtpVerification type="email" />}
      {step === 'mobile' && <OtpVerification type="mobile" />}
    </>
  );
}
