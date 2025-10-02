import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Modal } from './index';
import { Button } from '../..//atoms/Button';
import { FormGroup } from '../../molecules/FormGroup';
import { TextInput } from '../../atoms/TextInput';

/**
 * `Modal` is an organism component used to display content in a layer above the app.
 * It is used for critical information, confirmations, or short, focused tasks.
 * It must be accessible, handling focus trapping and keyboard interactions.
 */
const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility of the modal.',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function triggered when the modal requests to be closed.',
    },
    title: {
      control: 'text',
      description: 'The title displayed at the top of the modal.',
    },
    children: {
      control: 'text',
      description: 'The content to be rendered inside the modal body.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

// A template to manage the open/close state of the modal for stories.
const ModalTemplate: React.FC<{
  title: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}> = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {children}
      </Modal>
    </>
  );
};

/**
 * A basic informational modal with a title and simple text content.
 * This demonstrates the default appearance and behavior.
 */
export const BasicModal: Story = {
  render: (args) => (
    <ModalTemplate title={args.title || 'Basic Modal'}>
      <p>{args.children || 'This is the content of the modal. Press ESC or click the close button to dismiss.'}</p>
    </ModalTemplate>
  ),
  args: {
    title: 'Information',
    children: 'This is a basic informational message.',
  },
};

/**
 * A confirmation modal that includes action buttons in the children.
 * This is a common use case for confirming a user's action.
 */
export const ConfirmationModal: Story = {
  render: (args) => (
    <ModalTemplate title={args.title || 'Confirm Action'}>
      <p>Are you sure you want to perform this action? This cannot be undone.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
        <Button variant="secondary" onClick={() => alert('Cancelled')}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => alert('Confirmed')}>
          Confirm
        </Button>
      </div>
    </ModalTemplate>
  ),
  args: {
    title: 'Confirm Deletion',
  },
};

/**
 * A modal containing a form, demonstrating how complex organisms can be composed
 * of molecules and atoms to create a focused user task.
 */
export const FormModal: Story = {
  render: (args) => (
    <ModalTemplate title={args.title || 'Create New Item'}>
      <form onSubmit={(e) => { e.preventDefault(); alert('Form Submitted'); }}>
        <FormGroup label="Item Name" htmlFor="itemName">
          <TextInput id="itemName" placeholder="Enter item name" />
        </FormGroup>
        <FormGroup label="Description" htmlFor="itemDescription" style={{ marginTop: '16px' }}>
          <TextInput id="itemDescription" placeholder="Enter a brief description" />
        </FormGroup>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
          <Button variant="secondary" type="button" onClick={() => alert('Cancelled')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </div>
      </form>
    </ModalTemplate>
  ),
  args: {
    title: 'Add New Item',
  },
};

/**
 * This story includes an interaction test using the `play` function. It simulates
 * a user opening and then closing the modal, verifying its core functionality.
 */
export const InteractionTest: Story = {
  render: (args) => <ModalTemplate title="Interaction Test" initialOpen={false}><p>You can close me.</p></ModalTemplate>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state: Modal is not visible
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // 1. Find the "Open Modal" button and click it
    const openButton = await canvas.getByRole('button', { name: /open modal/i });
    await userEvent.click(openButton);

    // 2. The modal should now be visible
    const modal = await screen.findByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(within(modal).getByText('Interaction Test')).toBeVisible();

    // 3. Find the close button and click it
    // The close button is typically unlabeled, so we target it by its role and accessible name if available, or testId.
    const closeButton = await screen.getByLabelText(/close/i);
    await userEvent.click(closeButton);

    // 4. The modal should now be hidden again
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};