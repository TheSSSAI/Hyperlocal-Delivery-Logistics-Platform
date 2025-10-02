import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAuth } from '../../features/auth/useAuth';
import { AuthStackNavigationProp } from '../../navigation/navigation.types';

// Implements user stories CUS-003, RDR-004, VND-004 (partially)
const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const { requestLoginOtp, isLoading, error } = useAuth();
  const navigation = useNavigation<AuthStackNavigationProp<'Login'>>();

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const success = await requestLoginOtp(mobileNumber);
    if (success) {
      navigation.navigate('Otp', { mobileNumber, isRegistering: false });
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Welcome Back!</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Enter your mobile number to log in.</Text>
        
        <TextInput
          label="10-digit Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="number-pad"
          maxLength={10}
          mode="outlined"
          left={<TextInput.Affix text="+91 " />}
          style={styles.input}
          disabled={isLoading}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleSendOtp}
          loading={isLoading}
          disabled={isLoading || mobileNumber.length !== 10}
          style={styles.button}
        >
          Send OTP
        </Button>

        <View style={styles.footer}>
          <Text>Don't have an account?</Text>
          <Button onPress={() => navigation.navigate('Register')}>
            Register Now
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

export default LoginScreen;