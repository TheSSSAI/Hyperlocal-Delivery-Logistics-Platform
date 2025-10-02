import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { IModalProps } from './Modal.types';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.space16};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.space16};
  overflow-y: auto;
`;

const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const firstFocusableElement = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusableElement?.focus();
      }, 100); // Small delay to ensure modal is rendered
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <Backdrop onClick={onClose}>
      <ModalWrapper
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            &times;
          </CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalWrapper>
    </Backdrop>
  );

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    // Fallback if modal-root is not in the DOM, though it should be.
    return ReactDOM.createPortal(modalContent, document.body);
  }

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default React.memo(Modal);