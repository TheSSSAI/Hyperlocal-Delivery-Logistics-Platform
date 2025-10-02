import type { ReactNode } from 'react';

/**
 * Props for the Modal component.
 * This component provides a consistent and accessible way to present
 * content in a layer above the main application.
 */
export interface ModalProps {
  /**
   * Controls whether the modal is visible or hidden.
   */
  isOpen: boolean;

  /**
   * A callback function that is invoked when the user requests to close the modal
   * (e.g., by clicking the backdrop, pressing the Escape key, or clicking a close button).
   */
  onClose: () => void;

  /**
   * The content to be rendered inside the modal.
   */
  children: ReactNode;

  /**
   * An optional title to be displayed in the modal's header.
   */
  title?: string;

  /**
   * An optional component or content to be rendered in the modal's footer.
   * This is typically used for action buttons like 'Save' or 'Cancel'.
   */
  footer?: ReactNode;

  /**
   * Defines the width of the modal.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'full';

  /**
   * If `true`, the modal will not have padding around its content.
   * Useful for modals that contain content with its own padding.
   * @default false
   */
  disablePadding?: boolean;

  /**
   * An accessible label for the modal, read by screen readers.
   * Required if a `title` is not provided.
   */
  'aria-label'?: string;

  /**
   * The `id` of the element that serves as the modal's title.
   * Used for accessibility if the `title` prop is used.
   */
  'aria-labelledby'?: string;
}