import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Task } from '../../../shared/types/task.types';
import { cameraService } from '../../../lib/cameraService';
import { useTask } from '../hooks/useTask';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { permissionService } from '../../../lib/permissionService';

interface ProofOfDeliveryProps {
  task: Task;
}

const ProofOfDelivery: React.FC<ProofOfDeliveryProps> = ({ task }) => {
  const { submitPhotoPod, submitOtpPod, isSubmittingPod } = useTask();
  const [otp, setOtp] = useState('');

  const handleTakePhoto = async () => {
    const hasPermission = await permissionService.requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Camera access is needed for Proof of Delivery. Please enable it in your settings.',
      );
      return;
    }
    try {
      const photo = await cameraService.takePhoto();
      if (photo && photo.path) {
        // In a real app, we'd upload this photo and get a key/URL
        // For this simulation, we pass the local path for the hook to handle.
        await submitPhotoPod(task.id, photo.path);
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled image picker') {
        Alert.alert('Error', 'Could not capture photo. Please try again.');
        console.error('Photo capture error:', error);
      }
    }
  };
  
  const handleOtpSubmit = async () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP from the customer.');
      return;
    }
    await submitOtpPod(task.id, otp);
    setOtp('');
  };


  const renderPhotoPod = () => (
    <View style={styles.podContainer}>
      <Text style={styles.podTitle}>Proof of Delivery: Photo</Text>
      <Text style={styles.podInstruction}>Take a photo of the delivered item at the customer's doorstep.</Text>
      <Pressable
        style={({ pressed }) => [styles.button, styles.primaryButton, (pressed || isSubmittingPod) && styles.buttonPressed]}
        onPress={handleTakePhoto}
        disabled={isSubmittingPod}>
        {isSubmittingPod ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Take Photo</Text>
        )}
      </Pressable>
    </View>
  );

  const renderOtpPod = () => (
    <View style={styles.podContainer}>
      <Text style={styles.podTitle}>Proof of Delivery: OTP</Text>
      <Text style={styles.podInstruction}>Enter the 4-digit OTP provided by the customer to confirm delivery.</Text>
      <OTPInputView
        style={styles.otpInputContainer}
        pinCount={4}
        code={otp}
        onCodeChanged={setOtp}
        autoFocusOnLoad
        codeInputFieldStyle={styles.otpInputField}
        codeInputHighlightStyle={styles.otpInputHighlight}
      />
      <Pressable
        style={({ pressed }) => [styles.button, styles.primaryButton, (pressed || isSubmittingPod) && styles.buttonPressed]}
        onPress={handleOtpSubmit}
        disabled={isSubmittingPod}>
        {isSubmittingPod ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Confirm Delivery</Text>
        )}
      </Pressable>
    </View>
  );

  if (isSubmittingPod) {
    return (
        <View style={styles.podContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.podInstruction}>Submitting Proof of Delivery...</Text>
        </View>
    );
  }

  return task.podMethod === 'Photo' ? renderPhotoPod() : renderOtpPod();
};

const styles = StyleSheet.create({
    podContainer: {
        padding: 20,
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        margin: 15,
        alignItems: 'center',
    },
    podTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    podInstruction: {
        color: '#AEAEB2',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    otpInputContainer: {
        width: '80%',
        height: 60,
        marginBottom: 30,
    },
    otpInputField: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#3A3A3C',
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    otpInputHighlight: {
        borderColor: '#007AFF',
    },
});

export default ProofOfDelivery;