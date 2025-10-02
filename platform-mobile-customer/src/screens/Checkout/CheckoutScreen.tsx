import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput, Card } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useProfile } from '../../features/profile/useProfile';
import { useCart } from '../../features/cart/useCart';
import { CheckoutScreenProps } from '../../navigation/navigation.types';
import { Address } from '../../types/address.types';

// Implements CUS-020, CUS-021
const CheckoutScreen = ({ navigation }: CheckoutScreenProps) => {
  const { addresses, defaultAddress } = useProfile();
  const { total } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(defaultAddress);
  const [vendorInstructions, setVendorInstructions] = useState('');
  const [riderInstructions, setRiderInstructions] = useState('');

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      // Alert the user
      return;
    }
    navigation.navigate('Payment', {
      addressId: selectedAddress.id,
      vendorInstructions,
      riderInstructions,
    });
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Delivery Address" />
          <Card.Content>
            {selectedAddress ? (
              <TouchableOpacity onPress={() => navigation.navigate('AddressList', { isSelectMode: true })}>
                <Text>{selectedAddress.addressLine1}</Text>
                <Text>{selectedAddress.city}</Text>
              </TouchableOpacity>
            ) : (
              <Button onPress={() => navigation.navigate('AddressList', { isSelectMode: true })}>
                Select Address
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Special Instructions" />
          <Card.Content>
            <TextInput
              label="For Vendor (e.g., allergies, no onions)"
              value={vendorInstructions}
              onChangeText={setVendorInstructions}
              maxLength={250}
              multiline
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="For Rider (e.g., gate code, leave at door)"
              value={riderInstructions}
              onChangeText={setRiderInstructions}
              maxLength={250}
              multiline
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Order Summary" />
          <Card.Content>
             <View style={styles.summaryRow}>
              <Text variant="titleLarge">Total</Text>
              <Text variant="titleLarge">₹{total.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleProceedToPayment}
          disabled={!selectedAddress}
          style={styles.button}
        >
          Proceed to Payment
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
  },
   summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 8,
  },
});

export default CheckoutScreen;