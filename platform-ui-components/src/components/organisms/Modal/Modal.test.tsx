import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../theme';
import { Modal } from './index'; // Using the conditional export
import 'jest-styled-components';

// Mock the native implementation for web tests
jest.mock('./Modal.native', () => ({
  Modal: ({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) =>
    isOpen ? <div>{children}</div> : null,
}));

// We need to create a portal root for the modal to attach to in the test DOM
let portalRoot: HTMLElement;
beforeEach(() => {
  portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  document.body.removeChild(portalRoot);
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Modal', () => {
  it('should not be in the document when isOpen is false', () => {
    renderWithTheme(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render with title and children when isOpen is true', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', async () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    const closeButton = screen.getByLabelText(/close/i);
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the backdrop is clicked', async () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    // The backdrop is the element that contains the dialog
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      await userEvent.click(backdrop);
    }
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when the modal content is clicked', async () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByText('Modal Content'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should call onClose when the Escape key is pressed', async () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    await userEvent.keyboard('{escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should have correct ARIA attributes for accessibility', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Accessible Modal');
    
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
  });

  it('should trap focus within the modal when open', async () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={() => {}} title="Focus Trap">
        <button>First</button>
        <input placeholder="Second" />
        <a href="/">Third</a>
      </Modal>,
    );

    const firstElement = screen.getByRole('button', { name: 'First' });
    const secondElement = screen.getByPlaceholderText('Second');
    const thirdElement = screen.getByRole('link', { name: 'Third' });
    const closeButton = screen.getByLabelText(/close/i);

    // Initial focus on the modal container or first focusable element
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());

    // Tab forwards
    await userEvent.tab();
    expect(closeButton).toHaveFocus();
    
    await userEvent.tab();
    expect(firstElement).toHaveFocus();

    await userEvent.tab();
    expect(secondElement).toHaveFocus();

    await userEvent.tab();
    expect(thirdElement).toHaveFocus();

    // Loop back to the close button
    await userEvent.tab();
    expect(closeButton).toHaveFocus();

    // Tab backwards
    await userEvent.tab({ shift: true });
    expect(thirdElement).toHaveFocus();
  });
});