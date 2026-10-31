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
import {
  useForm,
  useFormContext,
  SubmitHandler,
  FieldValues,
  Resolver,
  Path,
  Controller,
  UseFormReturn,
  get,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import Typography from '../Typography';
import type { TextTag } from '../Typography/Typography';
import InputField from '../InputField';
import TextArea from '../TextArea';
import PasswordFeedback from '../PasswordFeedback';
import { PasswordHint } from '../PasswordFeedback/PasswordFeedback';
import CheckBox from '../CheckBox';
import Button from '../Button';
import { LucideIcon } from 'lucide-react';
import MobileNumberInput from '../MobileNumberInput';
import Dropdown, { DropdownOption } from '../Dropdown/Dropdown';
import clsx from 'clsx';
import styles from './DynamicForm.module.scss';

/**
 * Define the props available for the DynamicForm component.
 */
interface DynamicFormProps<T extends FieldValues = FieldValues> {
  /**
   * Array of field configurations used to dynamically render form fields.
   */
  fields: FieldConfig[];

  /**
   * Zod schema used for form validation. Not needed inside a parent
   * `FormProvider`, whose own schema validates the fields.
   */
  schema?: ZodSchema<T>;

  /**
   * CSS class name applied to the form container.
   */
  className?: string;

  /**
   * Callback function executed when the form is submitted. Not needed inside a
   * parent `FormProvider`, which owns the submit.
   */
  onSubmit?: SubmitHandler<T>;

  /**
   *
   */
  loading?: boolean;
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
  tag?: TextTag;
  className?: string;
  children?: ReactNode;
  width?: FieldWidth;
  required?: boolean;
  validationHints?: PasswordHint[];
  buttonType?: 'button' | 'submit' | 'reset';
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  iconColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxLength?: number;
  /** Hint below a text, `textarea` or `select` field, replaced by its error when there is one */
  helperText?: ReactNode;
  /** Browser autofill hint for a text field, e.g. `email` or `postal-code` */
  autoComplete?: string;
  /** On-screen keyboard for a text field, e.g. `numeric` for a PIN */
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search';
  /** Error from outside the form's schema, e.g. a list that failed to load. Shown ahead of the schema's own */
  error?: string;
  /** Visible lines of a `textarea` field */
  rows?: number;
  /** Fixed dial code of a `MobileNumberInput` field; +91 when left out */
  dialCode?: string;
  /** Choices for a `select` field */
  options?: DropdownOption<string>[];
  /** Lowest value of a `number` field, or earliest `"YYYY-MM-DD"` of a `date` field */
  min?: number | string;
  disabled?: boolean;
  /** Shows a text field's value without letting it be changed, e.g. details owned elsewhere */
  readOnly?: boolean;
  /** Shows a loading row in a `select` field's list */
  isLoading?: boolean;
  /** Runs after the user changes this field, e.g. to update a field that depends on it */
  onValueChange?: (form: UseFormReturn<any>) => void;
}

type FieldType =
  | 'label'
  | 'input'
  | 'email'
  | 'tel'
  | 'url'
  | 'password'
  | 'textarea'
  | 'checkbox'
  | 'select'
  | 'number'
  | 'date'
  | 'button'
  | 'MobileNumberInput';

export default function DynamicForm<T extends FieldValues>({
  fields,
  schema,
  className,
  loading,
  onSubmit,
}: DynamicFormProps<T>) {
  const parentForm = useFormContext<T>();
  const ownForm = useForm<T>({
    resolver: schema ? (zodResolver(schema as any) as unknown as Resolver<T>) : undefined,
    mode: 'all',
    reValidateMode: 'onChange',
  });
  // Inside a parent FormProvider the fields join that form, so the parent owns validation and submit
  const form = parentForm ?? ownForm;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = form;

  // Looked up by path so nested names like `itinerary.0.title` find their error
  const errorOf = (field: FieldConfig) =>
    field.error ?? (get(errors, field.name)?.message as string | undefined);

  // Only what an input understands: the rest of the config (width, onValueChange...) would land on the DOM
  const inputProps = (field: FieldConfig, type: string) => ({
    type,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    disabled: field.disabled,
    readOnly: field.readOnly,
    maxLength: field.maxLength,
    helperText: field.helperText,
    autoComplete: field.autoComplete,
    inputMode: field.inputMode,
    className: field.className,
    error: errorOf(field),
    ...register(field.name as Path<T>),
  });

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'label':
        return (
          <Typography
            tag={field.tag || 'p'}
            className={field.className}
            style={field.textAlign && { textAlign: field.textAlign }}
          >
            {field.label || field.children}
          </Typography>
        );

      case 'input':
        return <InputField {...inputProps(field, 'text')} />;

      // Their own types bring the matching keyboard and autofill on phones and tablets
      case 'email':
      case 'tel':
      case 'url':
        return <InputField {...inputProps(field, field.type)} />;

      case 'password':
        return (
          <>
            <InputField {...inputProps(field, 'password')} />
            <PasswordFeedback
              value={watch(field.name as Path<T>) || ''}
              hints={field.validationHints ?? []}
            />
          </>
        );

      case 'checkbox':
        return (
          <Controller
            name={field.name as Path<T>}
            control={control}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <CheckBox
                ref={ref}
                name={name}
                label={field.label as ReactNode}
                required={field.required}
                checked={!!value}
                onChange={(checked: boolean) => onChange(checked)}
                onBlur={onBlur}
                className={field.className}
                error={errorOf(field)}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <TextArea
            label={field.label}
            placeholder={field.placeholder}
            rows={field.rows}
            maxLength={field.maxLength}
            required={field.required}
            disabled={field.disabled}
            helperText={field.helperText}
            className={field.className}
            error={errorOf(field)}
            {...register(field.name as Path<T>)}
          />
        );

      case 'number':
      case 'date':
        return (
          <InputField
            label={field.label}
            type={field.type}
            inputMode={field.type === 'number' ? 'numeric' : undefined}
            min={field.min}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            className={field.className}
            error={errorOf(field)}
            {...register(field.name as Path<T>, {
              valueAsNumber: field.type === 'number',
              onChange: field.onValueChange && (() => field.onValueChange?.(form)),
            })}
          />
        );

      case 'select':
        return (
          <Controller
            name={field.name as Path<T>}
            control={control}
            render={({ field: { onChange, value, name }, fieldState }) => (
              <Dropdown
                name={name}
                label={field.label}
                placeholder={field.placeholder}
                options={field.options ?? []}
                value={value || null}
                onChange={(selected) => {
                  onChange(selected);
                  field.onValueChange?.(form);
                }}
                error={field.error ?? fieldState.error?.message}
                helperText={field.helperText}
                required={field.required}
                disabled={field.disabled}
                isLoading={field.isLoading}
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
            disabled={loading}
            loading={loading}
          >
            {field.label}
          </Button>
        );

      // Holds the national number only; the dial code is fixed
      case 'MobileNumberInput':
        return <MobileNumberInput {...inputProps(field, 'tel')} dialCode={field.dialCode} />;

      default:
        return null;
    }
  };

  const content = fields.map((field) => (
    <div
      key={field.name}
      className={clsx(styles.field, styles[`field--${field.width || FieldWidth.FULL}`])}
    >
      {renderField(field)}
    </div>
  ));

  // A <form> can't sit inside the parent's <form>
  if (parentForm) {
    return (
      <div data-testid="DynamicFormTest" className={className}>
        {content}
      </div>
    );
  }

  return (
    <form
      data-testid="DynamicFormTest"
      className={className}
      onSubmit={onSubmit && handleSubmit(onSubmit)}
    >
      {content}
    </form>
  );
}
