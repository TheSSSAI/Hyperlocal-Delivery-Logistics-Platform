import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ButtonProps } from './Button.types';

/**
 * `Button` is the primary atomic component for user actions.
 *
 * It supports different visual variants, sizes, and states like loading and disabled,
 * ensuring consistency for all interactive triggers across the platform.
 * It is built to be accessible and themeable.
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'link'],
      description: 'The visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button.',
    },
    children: {
      control: 'text',
      description: 'The content to display inside the button.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function for the click event.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the button will be disabled.',
    },
    isLoading: {
      control: 'boolean',
      description: 'If true, shows a loading spinner and disables the button.',
    },
  },
  args: {
    children: 'Button Text',
    disabled: false,
    isLoading: false,
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

/**
 * The primary action button. This is the default variant used for the most important action on a page.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

/**
 * The secondary action button. Used for less prominent actions, often alongside a primary button.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

/**
 * The danger action button. Used for destructive actions that have significant consequences, like deleting data.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

/**
 * The link variant. It looks like a hyperlink but behaves like a button. Used for tertiary actions.
 */
export const Link: Story = {
  args: {
    variant: 'link',
  },
};

/**
 * A large-sized button for emphasis on primary calls to action.
 */
export const Large: Story = {
  args: {
    size: 'large',
    variant: 'primary',
  },
};

/**
 * A medium-sized button, which is the default size for most use cases.
 */
export const Medium: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
  },
};

/**
 * A small-sized button for use in tight spaces or for less important actions.
 */
export const Small: Story = {
  args: {
    size: 'small',
    variant: 'primary',
  },
};

/**
 * A button in the disabled state. It is not interactive and has a distinct visual style.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * A button in the loading state. It shows a spinner to indicate an action is in progress and is disabled.
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};