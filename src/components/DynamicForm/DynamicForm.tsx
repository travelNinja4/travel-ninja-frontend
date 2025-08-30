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
import { useForm, SubmitHandler, FieldValues, Resolver, Path, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import Typography from '../Typography';
import { Tags, TextAlign } from '../Typography/Typography';
import TextField from '../TextField';
import PasswordFeedback from '../PasswordFeedback';
import { PasswordHint } from '../PasswordFeedback/PasswordFeedback';
import CheckBox from '../CheckBox';
import styles from './DynamicForm.module.scss';
import Button from '../Button';
import { LucideIcon } from 'lucide-react';

/**
 * Define the props available for the DynamicForm component.
 */
interface DynamicFormProps<T extends FieldValues = FieldValues> {
  fields: FieldConfig[];
  schema: ZodSchema<T>;
  className: string;
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
  label?: string | ReactNode;
  type?: FieldType;
  placeholder?: string;
  tag?: Tags;
  className?: string;
  children?: ReactNode;
  width?: FieldWidth;
  required?: boolean;
  validationHints?: PasswordHint[];
  buttonType?: 'button' | 'submit' | 'reset';
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  iconColor?: string;
  textAlign?: TextAlign;
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
  className,
  onSubmit,
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as unknown as Resolver<T>,
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const renderField = (field: FieldConfig) => {
    const value = watch(field.name as Path<T>) || '';
    const commonProps = {
      ...field,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...register(field.name as any),
      error: errors[field.name]?.message as string,
    };
    switch (field.type) {
      case 'label':
        return (
          <Typography tag={field.tag || 'p'} className={field.className} align={field.textAlign}>
            {field.label || field.children}
          </Typography>
        );

      case 'input':
        return <TextField {...commonProps} className={field.className} />;

      case 'password':
        return (
          <>
            <TextField {...commonProps} className={field.className} />
            <PasswordFeedback value={value} hints={field.validationHints ?? []} />
          </>
        );

      case 'checkbox':
        return (
          <Controller
            name={field.name as Path<T>}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CheckBox
                label={field.label as ReactNode}
                checked={!!value}
                onChange={(checked: boolean) => onChange(checked)}
                className={field.className}
              />
            )}
          />
        );

      case 'button':
        return (
          <Button
            key={field.name}
            type={field.buttonType || 'submit'}
            className={field.className}
            startIcon={field.startIcon}
            endIcon={field.endIcon}
            iconColor={field.iconColor}
          >
            {field.label}
          </Button>
        );

      default:
        null;
    }
  };

  return (
    <form data-testid="DynamicFormTest" className={className} onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <div
          key={field.name}
          className={`${className}__field ${className}__field--${field.width || FieldWidth.FULL}`}
        >
          {renderField(field)}
        </div>
      ))}
    </form>
  );
}
