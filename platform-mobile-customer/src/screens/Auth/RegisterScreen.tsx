import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAuth } from '../../features/auth/useAuth';
import { AuthStackNavigationProp } from '../../navigation/navigation.types';

// Implements user stories CUS-001, CUS-002
const RegisterScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { requestRegisterOtp, isLoading, error } = useAuth();
  const navigation = useNavigation<AuthStackNavigationProp<'Register'>>();

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Invalid Name', 'Please enter your full name.');
      return;
    }
    // Basic email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Terms and Conditions', 'You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    const success = await requestRegisterOtp(mobileNumber, name, email);
    if (success) {
      navigation.navigate('Otp', { mobileNumber, isRegistering: true });
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
        
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          disabled={isLoading}
        />

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

        <TextInput
          label="Email (Optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          disabled={isLoading}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agreedToTerms ? 'checked' : 'unchecked'}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          />
          <Text style={styles.checkboxLabel}>I agree to the Terms of Service and Privacy Policy.</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleSendOtp}
          loading={isLoading}
          disabled={isLoading || !agreedToTerms}
          style={styles.button}
        >
          Send OTP
        </Button>

        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <Button onPress={() => navigation.navigate('Login')}>
            Log In
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
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    paddingVertical: 8,
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});

export default RegisterScreen;