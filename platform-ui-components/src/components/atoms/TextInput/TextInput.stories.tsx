import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';
import { TextInputProps } from './TextInput.types';

/**
 * `TextInput` is an atomic component for user text input in forms.
 *
 * It supports standard input features like placeholders, types, and states
 * such as disabled and error. It is designed to be composed into more complex
 * form elements like `FormGroup`.
 */
const meta: Meta<typeof TextInput> = {
  title: 'Atoms/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the input will be disabled.',
    },
    error: {
      control: 'text',
      description: 'If a string is provided, displays the error state and message.',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
      description: 'The type of the input field.',
    },
    value: {
      control: 'text',
      description: 'The controlled value of the input.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function for the change event.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

// To showcase a controlled component, we use a render function.
const Template: React.FC<Partial<TextInputProps>> = (args) => {
  const [value, setValue] = useState(args.value || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    args.onChange?.(event);
  };

  return <TextInput {...args} value={value} onChange={handleChange} />;
};

/**
 * The default state of the TextInput component, with a placeholder.
 */
export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    placeholder: 'Enter your name',
  },
};

/**
 * TextInput with a pre-filled value. This demonstrates a controlled component in action.
 */
export const WithValue: Story = {
  render: (args) => <Template {...args} />,
  args: {
    value: 'John Doe',
  },
};

/**
 * The disabled state of the TextInput. The user cannot interact with it.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'You cannot edit this',
    disabled: true,
  },
};

/**
 * The error state of the TextInput. This is used to indicate a validation error from a form.
 * In a real application, the error message would be displayed by the `FormGroup` component.
 */
export const WithError: Story = {
  render: (args) => <Template {...args} />,
  args: {
    value: 'invalid-email',
    error: 'Please enter a valid email address.', // Note: This prop styles the input, but FormGroup shows the message
  },
};

/**
 * An example of a password input field, where the entered text is masked.
 */
export const Password: Story = {
  render: (args) => <Template {...args} />,
  args: {
    placeholder: 'Enter your password',
    type: 'password',
  },
};