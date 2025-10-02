import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Linking } from 'react-native';

interface PermissionDeniedModalProps {
  isVisible: boolean;
  onClose: () => void;
  permissionName: 'Location' | 'Camera';
  message: string;
}

const PermissionDeniedModal: React.FC<PermissionDeniedModalProps> = ({
  isVisible,
  onClose,
  permissionName,
  message,
}) => {

  const handleGoToSettings = () => {
    Linking.openSettings();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{permissionName} Permission Required</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.settingsButton]} onPress={handleGoToSettings}>
              <Text style={styles.buttonText}>Go to Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#EBEBF5',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#3A3A3C',
    marginRight: 10,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PermissionDeniedModal;