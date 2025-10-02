import React from 'react';
import { Modal as RNModal, Pressable, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { IModalProps } from './Modal.types';

const Backdrop = styled(Pressable)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.background.default};
  width: 90%;
  max-height: 80%;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.space16};
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  elevation: 10;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.space12};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.default};
  padding-bottom: ${({ theme }) => theme.spacing.space8};
`;

const ModalTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.space4};
`;

const CloseButtonText = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 24px;
`;

const ModalBody = styled.View``;

const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <RNModal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      hardwareAccelerated
    >
      <Backdrop onPress={onClose}>
        {/* The Pressable below prevents the backdrop's onPress from firing when content is tapped */}
        <Pressable>
            <ModalContainer>
            <ModalHeader>
                <ModalTitle
                accessibilityRole="header"
                accessibilityLabel={`Modal title: ${title}`}
                >
                {title}
                </ModalTitle>
                <CloseButton onPress={onClose} accessibilityLabel="Close modal">
                <CloseButtonText>&times;</CloseButtonText>
                </CloseButton>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            </ModalContainer>
        </Pressable>
      </Backdrop>
    </RNModal>
  );
};

export default React.memo(Modal);