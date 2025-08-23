'use client';
import TextField from '@/components/TextField';
import styles from './page.module.css';
import React, { useState } from 'react';
import CustomImage from '@/components/CustomImage';
import { Camera } from 'lucide-react';
import AppLink from '@/components/AppLink';
import DynamicForm from '@/components/DynamicForm';
import { registrationFormConfig } from '@/lib/formConfig/authForm';
import { registrationSchema } from '@/lib/zodSchemas/auth.schema';

export default function Home() {
  const [value, setValue] = useState('');
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <DynamicForm
        fields={registrationFormConfig}
        schema={registrationSchema}
        onSubmit={() => {}}
      />
    </div>
  );
}
