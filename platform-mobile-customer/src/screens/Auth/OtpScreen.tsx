import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAuth } from '../../features/auth/useAuth';
import { OtpScreenProps } from '../../navigation/navigation.types';

// Implements user stories CUS-001, CUS-003, CUS-004, CUS-005, RDR-004, VND-004
const OtpScreen = ({ route }: OtpScreenProps) => {
  const { mobileNumber, isRegistering } = route.params;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const {
    verifyLoginOtp,
    verifyRegisterOtp,
    requestLoginOtp,
    requestRegisterOtp,
    isLoading,
    error,
  } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP.');
      return;
    }
    if (isRegistering) {
      await verifyRegisterOtp(mobileNumber, otp);
    } else {
      await verifyLoginOtp(mobileNumber, otp);
    }
    // On success, RootNavigator will automatically handle the switch to AppNavigator
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setTimer(60); // Reset timer
    if (isRegistering) {
      await requestRegisterOtp(mobileNumber);
    } else {
      await requestLoginOtp(mobileNumber);
    }
    Alert.alert('OTP Sent', 'A new OTP has been sent to your mobile number.');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Verify Your Number</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter the 6-digit code sent to +91 {mobileNumber}
        </Text>

        <TextInput
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          mode="outlined"
          style={styles.input}
          disabled={isLoading}
        />
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleVerifyOtp}
          loading={isLoading}
          disabled={isLoading || otp.length !== 6}
          style={styles.button}
        >
          {isRegistering ? 'Verify & Register' : 'Verify & Log In'}
        </Button>

        <View style={styles.footer}>
          <Text>Didn't receive a code?</Text>
          <Button onPress={handleResendOtp} disabled={timer > 0}>
            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});

export default OtpScreen;