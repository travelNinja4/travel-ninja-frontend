import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import { z } from 'zod';
import DynamicForm, { FieldConfig, FieldWidth } from './DynamicForm';

const schema = z
  .object({
    fullName: z.string().min(1, 'Full Name is required'),
    agencyName: z.string().optional(),
    email: z.string().email('Invalid email address'),
    website: z.string().url('Invalid URL').optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postCode: z.string().min(1, 'Post Code is required'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'One uppercase letter')
      .regex(/[a-z]/, 'One lowercase letter')
      .regex(/\d/, 'One number')
      .regex(/[@$!%*?&]/, 'One special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const mockFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Create Your Agency Account',
    type: 'label',
    tag: 'h2',
    children: null,
    validationHints: [],
  },
  {
    name: 'subTitle',
    label: 'Start your journey with TravelNinja today',
    type: 'label',
    tag: 'h3',
    validationHints: [],
  },
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'input',
    placeholder: 'Enter full name',
    required: true,
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'agencyName',
    label: 'Agency Name',
    type: 'input',
    placeholder: 'Enter agency name',
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'input',
    required: true,
    placeholder: 'Enter email address',
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'website',
    label: 'Website(optional)',
    type: 'input',
    placeholder: 'https://yourwebsite.com',
    width: FieldWidth.HALF,
    validationHints: [],
  },
  {
    name: 'address',
    label: 'Address',
    type: 'input',
    placeholder: 'Enter full address',
    required: true,
    width: FieldWidth.FULL,
    validationHints: [],
  },
  {
    name: 'city',
    label: 'City',
    type: 'input',
    placeholder: 'Enter city',
    required: true,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'state',
    label: 'State',
    type: 'input',
    placeholder: 'Enter State',
    required: true,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'postCode',
    label: 'Post Code',
    type: 'input',
    placeholder: 'Enter post code',
    required: true,
    width: FieldWidth.THIRD,
    validationHints: [],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a password',
    required: true,
    width: FieldWidth.HALF,
    validationHints: [
      { label: 'At least 8 characters', regex: /^.{8,}$/ },
      { label: 'One uppercase letter', regex: /[A-Z]/ },
      { label: 'One lowercase letter', regex: /[a-z]/ },
      { label: 'One number', regex: /\d/ },
      { label: 'One special character', regex: /[@$!%*?&]/ },
    ],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'input',
    placeholder: 'Confirm your password',
    required: true,
    width: FieldWidth.HALF,
    validationHints: [],
  },
];

const meta = {
  title: 'components/DynamicForm',
  component: DynamicForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    fields: mockFields,
    schema,
    className: 'dynamic-form',
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
  },
} satisfies Meta<typeof DynamicForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
