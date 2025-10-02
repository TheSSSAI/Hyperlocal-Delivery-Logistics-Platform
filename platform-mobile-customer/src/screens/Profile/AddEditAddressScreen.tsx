import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useProfile } from '../../features/profile/useProfile';
import { AddEditAddressScreenProps } from '../../navigation/navigation.types';
import MapView, { Marker } from 'react-native-maps';

// Implements CUS-007, CUS-008
const AddEditAddressScreen = ({ route, navigation }: AddEditAddressScreenProps) => {
  const { addressId } = route.params || {};
  const { addresses, addAddress, updateAddress, isLoading } = useProfile();
  
  const existingAddress = addressId ? addresses.find(a => a.id === addressId) : null;

  const [formState, setFormState] = useState({
    addressLine1: existingAddress?.addressLine1 || '',
    city: existingAddress?.city || '',
    pincode: existingAddress?.pincode || '',
    addressType: existingAddress?.addressType || 'Home',
    location: existingAddress?.location || { lat: 19.0760, lng: 72.8777 }, // Default to Mumbai
  });
  const [errors, setErrors] = useState<Partial<typeof formState>>({});

  const handleSave = async () => {
    // Simple validation
    const newErrors: Partial<typeof formState> = {};
    if (!formState.addressLine1.trim()) newErrors.addressLine1 = 'This field is required';
    if (!formState.city.trim()) newErrors.city = 'This field is required';
    if (!/^[1-9][0-9]{5}$/.test(formState.pincode)) newErrors.pincode = 'Invalid Pincode';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    let success = false;
    if (addressId) {
      success = await updateAddress(addressId, formState);
    } else {
      success = await addAddress(formState);
    }

    if (success) {
      navigation.goBack();
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>{addressId ? 'Edit Address' : 'Add New Address'}</Text>
        
        <MapView
            style={styles.map}
            region={{
                latitude: formState.location.lat,
                longitude: formState.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            onRegionChangeComplete={(region) => setFormState(prev => ({...prev, location: {lat: region.latitude, lng: region.longitude}}))}
        >
            <Marker coordinate={{latitude: formState.location.lat, longitude: formState.location.lng}} draggable/>
        </MapView>
        
        <TextInput
          label="House / Flat No., Building"
          value={formState.addressLine1}
          onChangeText={text => setFormState(prev => ({ ...prev, addressLine1: text }))}
          mode="outlined" style={styles.input}
          error={!!errors.addressLine1}
        />
        {errors.addressLine1 && <Text style={styles.errorText}>{errors.addressLine1}</Text>}

        <TextInput
          label="City"
          value={formState.city}
          onChangeText={text => setFormState(prev => ({ ...prev, city: text }))}
          mode="outlined" style={styles.input}
          error={!!errors.city}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        
        <TextInput
          label="Pincode"
          value={formState.pincode}
          onChangeText={text => setFormState(prev => ({ ...prev, pincode: text }))}
          keyboardType="number-pad"
          maxLength={6}
          mode="outlined" style={styles.input}
          error={!!errors.pincode}
        />
        {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
        
        {/* Address Type selection would go here */}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Save Address
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
  },
  map: {
      height: 200,
      marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
});

export default AddEditAddressScreen;