import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormGroup } from './FormGroup';

/**
 * `FormGroup` is a molecular component that combines a `Label` and a form control
 * (like `TextInput`) with an optional error message. It handles the layout, spacing,
 * and accessibility linking between these elements.
 */
const meta: Meta<typeof FormGroup> = {
  title: 'Molecules/FormGroup',
  component: FormGroup,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The text for the form group label.',
    },
    error: {
      control: 'text',
      description: 'An error message to display below the input.',
    },
    htmlFor: {
      control: 'text',
      description: 'The ID of the input element this label is for.',
    },
    children: {
      control: false, // Children are passed as nested components, not props.
      description: 'The form input component (e.g., TextInput).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormGroup>;

/**
 * The default state of a FormGroup, containing a Label and a TextInput.
 * This is the standard way to present a single form field.
 */
export const Default: Story = {
  args: {
    label: 'Full Name',
    htmlFor: 'fullName',
    children: <meta.component.defaultProps.children.type id="fullName" placeholder="e.g., John Doe" />,
  },
};

/**
 * The error state of a FormGroup. When the `error` prop is provided,
 * it displays a formatted error message below the input, which is crucial for
 * form validation feedback.
 */
export const WithError: Story = {
  args: {
    label: 'Email Address',
    htmlFor: 'email',
    error: 'Please enter a valid email address.',
    children: <meta.component.defaultProps.children.type id="email" placeholder="john.doe@example.com" error="true" />,
  },
};

/**
 * A FormGroup for a password field, demonstrating how it composes with different
 * types of inputs while maintaining consistent styling and layout.
 */
export const Password: Story = {
  args: {
    label: 'Password',
    htmlFor: 'password',
    children: <meta.component.defaultProps.children.type id="password" type="password" placeholder="Enter your password" />,
  },
};