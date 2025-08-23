/**
 * The DynamicForm component is a reusable dynamic form builder that generates form fields based on a given configuration
 *
 * @example
 * ```tsx
 * import DynamicForm from '@src/components/DynamicForm'
 *
 * export default function DynamicForm() {
 *   return <DynamicForm label="Hello" />;
 * }
 * ```
 */
'use client';

import React, { ReactNode } from 'react';
import { useForm, SubmitHandler, FieldValues, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import styles from './DynamicForm.module.scss';
import Typography from '../Typography';
import { Tags } from '../Typography/Typography';
import TextField from '../TextField';

/**
 * Define the props available for the DynamicForm component.
 */
interface DynamicFormProps<T extends FieldValues = FieldValues> {
  fields: FieldConfig[];
  schema: ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
}

/**
 * Enum for safe width values
 */
export enum FieldWidth {
  FULL = 'full',
  HALF = 'half',
  THIRD = 'third',
}

export interface FieldConfig {
  name: string;
  label?: string;
  type?: FieldType;
  placeholder?: string;
  tag?: Tags;
  className?: string;
  children?: ReactNode;
  width?: FieldWidth;
  required?: boolean;
}

type FieldType =
  | 'label'
  | 'input'
  | 'email'
  | 'tel'
  | 'password'
  | 'textarea'
  | 'checkbox'
  | 'select'
  | 'button';

export default function DynamicForm<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema) as unknown as Resolver<T>,
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      ...field,
      ...register(field.name as any),
      error: errors[field.name]?.message as string,
    };
    switch (field.type) {
      case 'label':
        return <Typography tag={field.tag || 'p'}>{field.label || field.children}</Typography>;

      case 'input':
        return <TextField {...commonProps} />;

      default:
        null;
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <div
          key={field.name}
          className={`${styles.field} ${styles[`field--${field.width || FieldWidth.FULL}`]}`}
        >
          {renderField(field)}
        </div>
      ))}
    </form>
  );
}
